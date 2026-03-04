import HttpException from './http.exception';

class ConflictException extends HttpException {
  constructor(message = 'Resource already exists') {
    super(409, message);
  }
}

export default ConflictException;
