/** @format */

import DataLoader from 'dataloader';
import { User } from '../entities/User';

export const createUserLoader = () =>
  new DataLoader<number, User>(async (keys) => {
    const users = await User.find({
      where: keys.map((uid) => ({ id: uid })),
    });

    const userIdToUser: Record<number, User> = {};
    users.forEach((u) => {
      userIdToUser[u.id] = u;
    });

    return keys.map((uid) => userIdToUser[uid]);
  });
