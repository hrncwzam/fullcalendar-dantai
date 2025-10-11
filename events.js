async function loadEvents() {
    const response = await fetch('./events.json');
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