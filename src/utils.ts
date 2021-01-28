/**
 * Returns whether or not the code is running on the server side.
 */
export const isServerSide: () => boolean = () => typeof window === 'undefined';
