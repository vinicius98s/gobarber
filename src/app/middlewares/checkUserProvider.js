import User from '../models/User';

export default async (req, res, next) => {
  const id = req.body.provider_id || req.userId;

  const isProvider = await User.findOne({
    where: { id, provider: true },
  });

  if (!isProvider)
    return res.status(401).json({ error: 'User is not a provider.' });

  return next();
};
