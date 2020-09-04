// TODO: JSDoc
export const generateMessage = (username, text) => ({
  username,
  text,
  createdAt: new Date().getTime(),
});
