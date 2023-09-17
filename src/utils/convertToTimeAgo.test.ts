import timeAgo from './convertToTimeAgo';

describe('timeAgo function', () => {
  it('should return "30 seconds ago" for a timestamp 30 seconds in the past', () => {
    expect(timeAgo(new Date(Date.now() - 30000).toISOString())).toBe(
      '30 seconds ago'
    );
  });

  it('should return "1 minute ago" for a timestamp 1 minute in the past', () => {
    expect(timeAgo(new Date(Date.now() - 60000).toISOString())).toBe(
      '1 minute ago'
    );
  });

  it('should return "1 hour ago" for a timestamp 1 hour in the past', () => {
    expect(timeAgo(new Date(Date.now() - 3600000).toISOString())).toBe(
      '1 hour ago'
    );
  });

  it('should return "1 day ago" for a timestamp 1 day in the past', () => {
    expect(timeAgo(new Date(Date.now() - 86400000).toISOString())).toBe(
      '1 day ago'
    );
  });
});
