import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Notification from '../schemas/Notification';

import User from '../models/User';
import Appointment from '../models/Appointment';
import File from '../models/File';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const offsetCalc = (page - 1) * 20;
    const offset = offsetCalc > 0 ? offsetCalc : 0;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      attributes: ['id', 'date'],
      order: ['date'],
      limit: 20,
      offset,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Failed validation' });
    }

    const { provider_id, date } = req.body;

    if (provider_id === req.userId)
      return res
        .status(400)
        .json({ error: "You can't add an appointment for yourself" });

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date()))
      return res.status(400).json({ error: 'Past dates are not permitted' });

    const checkExistingAppointment = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkExistingAppointment)
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: ptBR }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    return res.json({
      id: appointment.id,
      user_id: appointment.user_id,
      provider_id: appointment.provider_id,
      date: appointment.date,
    });
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: User, as: 'provider', attributes: ['name', 'email'] },
        { model: User, as: 'user', attributes: ['name'] },
      ],
    });

    if (appointment.user_id !== req.userId)
      return res.status(401).json({
        error: 'You are not allowed to cancel this appointment',
      });

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date()))
      return res.status(401).json({
        error: 'You can only cancel appointments with 2 hours in advance',
      });

    appointment.canceled_at = new Date();

    await appointment.save();

    Queue.add(CancellationMail.key, { appointment });

    return res.json(appointment);
  }
}

export default new AppointmentController();
