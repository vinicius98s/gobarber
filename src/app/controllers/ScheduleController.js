import { startOfDay, endOfDay, parseISO, isValid } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';

class ScheduleController {
  async index(req, res) {
    const { date } = req.query;

    const isValidDate = isValid(parseISO(date));

    if (date && !isValidDate)
      return res.status(400).json({ error: 'Invalid date' });

    const parsedDate = isValidDate ? parseISO(date) : new Date();

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
