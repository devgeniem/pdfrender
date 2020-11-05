export class ControllerError extends Error {
  constructor(message: string, public readonly responseCode: number = 500) {
    super(message);
  }
}

export const isControllerError = (error: any): error is ControllerError => {
  return error.message !== undefined && error.responseCode !== undefined;
};
