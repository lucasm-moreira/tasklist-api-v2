import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';
import configJwtBlacklist from '../../config/jwt-blacklist';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    // Verifica se o e-mail é cadastrado no banco de dados
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      res.status(401).json({ response: 'Usuário não cadastrado!' });
    }

    // Verifica password
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ response: 'Senha incorreta!' });
    }

    const { id, name } = user;

    return res.status(200).json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }

  async logout(req, res) {
    const blacklist = await configJwtBlacklist.configJwtBlacklist();

    const authHeader = req.headers.authorization;

    // Descarta a primeira posição, ou seja, a palavra Bearer
    const [, token] = authHeader.split(' ');

    blacklist.add(token);

    return res.status(200).json({ response: 'Deslogado com sucesso!' });
  }
}

export default new SessionController();
