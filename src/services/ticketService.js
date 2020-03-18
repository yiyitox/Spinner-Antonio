import http from './httpService';
import { apiUrl } from '../config.json';

const apiEndpoint = apiUrl + '/api/v1/tickets/';

export function getTicketTypes() {
  const apiEndpointTypes = apiUrl + '/api/v1/ticket_types/';
  return http.get(apiEndpointTypes);
}

export function getTicketCategories() {
  const apiEndpointTypes = apiUrl + '/api/v1/categories/';
  return http.get(apiEndpointTypes);
}

export function getTicketStatus() {
  const apiEndpointTypes = apiUrl + '/api/v1/ticket_status/';
  return http.get(apiEndpointTypes);
}

export function getTickets(filters) {
  return http.get(apiEndpoint + filters);
}

export function getTicket(id) {
  return http.get(apiEndpoint + id + '/');
}

export function patchTicket(id, ticket) {
  return http.patch(apiEndpoint + id + '/close/', ticket);
}

export function patchTicketAssign(id, ticket) {
  return http.patch(apiEndpoint + id + '/', ticket);
}

export function saveTicket(ticket) {
  return http.post(apiEndpoint, ticket);
}

export function saveComment(comment) {
  const apiEndpointComment = apiUrl + '/api/v1/comments/';
  return http.post(apiEndpointComment, comment);
}

export function getUserList(filter) {
  const apiEndpointUsers = apiUrl + '/api/v1/users/' + (filter ? filter : '');
  return http.get(apiEndpointUsers);
}
