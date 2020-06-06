import random = require('random');

export function generateValueSensor(): number[] {
  return [random.int(0, 1023)];
}

export function conditionFan(payload: any, topic: string): number {
  if (
    !payload.value[0].match(/[0-1]/) ||
    !payload.value[1].match(/[1-3]/) ||
    topic !== 'T_2'
  ) {
    return 0;
  }

  const id = payload.device_id;
  const extract = id.match(/^id(\d+)_(\d+)$/);
  if (extract[1] === '2') {
    return Number(extract[2]) || 0;
  }

  return 0;
}

export function extractorFan(payload): number[] {
  return [Number(payload.value[1]), Number(payload.value[0])];
}
