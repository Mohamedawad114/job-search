export const encoderCursor = (_id: string, createdAt: Date) => {
  const str = JSON.stringify({ _id, createdAt });
  return Buffer.from(str).toString('base64');
};
export const decoderCursor = (cursor?: string) => {
  if (!cursor) return null;
  const decodedStr = Buffer.from(cursor, 'base64').toString('utf-8');
  return JSON.parse(decodedStr);
};
