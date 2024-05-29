export const extractEventType = (events) => {
  // console.log('events: ', events);
  return events.map((x) => x.type.split(".").pop());
};
