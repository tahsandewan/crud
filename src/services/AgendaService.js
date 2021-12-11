import { Agenda } from "../models/Agenda";
import Moment from "moment";
export class AgendaService {

  static instance = new AgendaService();

  constructor() {
    this.count = 0;
    this.agendas = [];
  }

  /**
   *
   * @param {Number} agendaId
   * @returns {Agenda}
   */
  getById(agendaId) {
    return this.agendas[agendaId];
  }

  /**
   * @returns {Array<Agenda>}
   */
  getAll() {
    return this.agendas;
  }

  /**
   *
   * @param {Agenda} agenda
   * @returns {Agenda}
   */
  post(agenda) {
       let d = new Date();
       var today = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const currentDate = today;
    const agendaId = this.count;

    this.count++;

    const _agenda = {
      id: agendaId,
      title: agenda.title,
      description: agenda.description,
      status: agenda.status,
      date: Moment(agenda.date).format("yyyy-MM-DD"),
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    this.agendas.push(_agenda);

    return _agenda;
  }

  /**
   *
   * @param {Number} agendaId
   * @param {Agenda} agenda
   * @returns {undefined | Agenda}
   */
  updateById(agendaId, agenda) {
    const _agenda = this.agendas[agendaId];

    if (!_agenda) {
      return undefined;
    }
     let d = new Date();
     var today = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const currentDate = today;

    _agenda.title = agenda.title;
    _agenda.description = agenda.description;
    _agenda.status = agenda.status;
    _agenda.date = agenda.date;
    _agenda.updatedAt = currentDate;

    return _agenda;
  }

  /**
   *
   * @param {Number} agendaId
   * @returns {undefined | Agenda}
   */
  deleteById(agendaId) {
    const agenda = this.agendas[agendaId];

    if (!agenda) {
      return undefined;
    }

    delete this.agendas[agendaId];

    return agenda;
  }
}
