function getCacheBusterKey() {
  const now = new Date();
  const minutes = now.getUTCMinutes();
  const rounded = Math.floor(minutes / 10) * 10; // 10分単位に丸める
  const key = `${now.getUTCFullYear()}${now.getUTCMonth() + 1}${now.getUTCDate()}${now.getUTCHours()}${rounded}`;
  return key;
}

async function loadEvents() {
    const cacheKey = getCacheBusterKey();
    const response = await fetch('./events.json?cd=${cacheKey}');
    if(!response.ok) {
        console.error('Failed to load events.json',response.status);
        return [];
    }

    const data = await response.json();

    const events = data.map(item => ({
        title: item.title,
        start: item.start,
        extendedProps: {
            pref: item.pref,
            place: item.place,
            url: item.url
        }
    }));

    return events;
}
