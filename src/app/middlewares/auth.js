import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';
import configJwtBlacklist from '../../config/jwt-blacklist';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ response: 'Token não existe!' });
  }

  // Descarta a primeira posição, ou seja, a palavra Bearer
  const [, token] = authHeader.split(' ');

  const blacklist = await configJwtBlacklist.configJwtBlacklist();

  if (await blacklist.has(token)) {
    return res.status(400).json({ response: 'Você não está logado!' });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // Atribui o payload extraído por meio da decodificação do token, nesse caso é o id de usuário. Isso foi setado no SessionController.js
    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(400).json({ response: 'Token inválido!' });
  }
};
