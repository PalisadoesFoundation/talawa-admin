export interface InterfaceAction<T = unknown> {
  type: string;
  payload: T;
}
