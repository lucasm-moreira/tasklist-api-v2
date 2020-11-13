import * as Yup from 'yup';
import Task from '../models/Task';

class TaskController {
  async index(req, res) {
    const tasks = await Task.findAll({
      where: { user_id: req.userId, check: false },
    });

    return res.status(200).json({ tasks });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      task: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json(400).json({ response: 'Falha na validação!' });
    }

    const { task } = req.body;

    const tasks = await Task.create({
      user_id: req.userId,
      task,
    });

    return res.status(201).json({ tasks });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      task: Yup.string(),
      check: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ response: 'Falha na validação!' });
    }

    const { task_id } = req.params;

    const task = await Task.findByPk(task_id);

    if (!task) {
      return res.status(400).json({ response: 'Tarefa inexistente!' });
    }

    if (task.user_id !== req.userId) {
      return res.status(401).json({ response: 'Não autorizado!' });
    }

    await task.update(req.body);

    return res.status(200).json({ task });
  }

  async delete(req, res) {
    const { task_id } = req.params;

    const task = await Task.findByPk(task_id);

    if (!task) {
      return res.status(400).json({ response: 'Tarefa inexistente!' });
    }

    if (task.user_id !== req.userId) {
      return res.status(401).json({ response: 'Não autorizado!' });
    }

    await task.destroy();

    return res.status(200).json({ response: 'Tarefa deletada com sucesso!' });
  }
}

export default new TaskController();
