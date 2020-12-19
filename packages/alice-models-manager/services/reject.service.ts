import { HandlerContext } from '@loopback/rest/dist/types';
import { HttpError } from 'http-errors';
import { inject } from '@loopback/core';
import { LoggerService } from './logger.service';
import { RejectProvider } from '@loopback/rest';

// For whatever reason Loopback 4 is bad at propagating its own errors:
// it rewraps them into message field, so propagated error could look like this:
// {"statusCode":400,"message":"{\"error\":{\"statusCode\":400,\"name\":\"BadRequestError\",\"message\":\"Reason bla bla bla\"}}"}
// Here we unwrap error.message if possible.
export class CustomRejectProvider extends RejectProvider {
  constructor(@inject('services.LoggerService') private logger: LoggerService) {
    super((err, statusCode, request) => {
      this.logger.warning(`Returning non-OK http status: ${err.message}, status = ${statusCode}`, { err, request });
    });
  }

  action({ request, response }: HandlerContext, error: Error) {
    const statusCode = (error as HttpError).statusCode;
    if (statusCode) {
      try {
        error = <HttpError>JSON.parse(error.message) ?? error;
      } catch (e) {
        // This is fine, probably error was returned by non-Nest service, so let's keep current error value
      }
      if (statusCode == 400) {
        // UserVisibleError goes here, no need to alert or warn in logs.
        this.logger.info(error.message, error);
      } else if (statusCode == 404) {
        // Typically still caused by a user doing something weird, no need to alert,
        // but it's nice to have an error in logs.
        this.logger.error(error.message, error);
      } else if (statusCode == 422) {
        this.logger.error(error.message, error);
      } else {
        this.logger.error(error.message, error);
      }
    } else {
      this.logger.error(error.message, error);
    }

    super.action({ request, response }, error);
  }
}
