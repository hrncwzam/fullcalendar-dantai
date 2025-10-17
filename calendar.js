document.addEventListener('DOMContentLoaded', async function() {
    const calendarEl = document.getElementById('calendar');

    const events = await loadEvents();

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        views:{
            dayGridMonth:{
                buttonText: 'cal',
                duration: { months: 2 },
                dateIncrement: { months: 1 }
            },
            listMonth:{
                buttonText: 'list',
                duration: { months: 2 },
                dateIncrement: { months: 1 }
          }
        },
        locale: 'ja',
        timeZone: 'local',
        contentHeight: 'auto', // または数値で指定: 600
        height: 'auto',
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,listMonth'
        },
        datesSet: function(info) {
            const start = info.start;
            const end = new Date(info.end.getTime() - 1); // 終了日の1日前

            const startYear = start.getFullYear();    
            const endYear = end.getFullYear();
            const startMonth = start.getMonth() + 1;
            const endMonth = end.getMonth() + 1;

            const customTitle = startYear === endYear
                ? `${startYear} ${startMonth}-${endMonth}`
                : `${startYear} ${startMonth} - ${endYear} ${endMonth}`;

            const titleEl = document.querySelector('.fc-toolbar-title');
            if (titleEl) {
                titleEl.textContent = customTitle;
            }
        },

        dayCellDidMount: function(info) {
            const date = info.date;
            // 祝日判定 → クラス追加のみ（祝日名は表示しない）
            if (JapaneseHolidays.isHoliday(date)) {
                info.el.classList.add('fc-day-holiday');
            }
        },
        eventDisplay: 'block',
        events: events,
        eventContent: function(arg) {
            const start = arg.event.start;
            const timeText = start
                ? start.toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
            })
            : '';
            const pref = arg.event.extendedProps.pref;
            const place = arg.event.extendedProps.place;
            const title = arg.event.title;
            if (arg.view.type === 'dayGridMonth') {
                const innerHtml = `
                    <div class="fc-custom-event">
                        <div class="fc-event-time">${timeText}</div>
                        <div class="fc-event-title">${title}</div>
                        <div class="fc-event-place">${place}</div>
                    </div>
                `;
                return { html: innerHtml };
            } else if (arg.view.type === 'listMonth') {
                const innerHtml = `
                    <div class="fc-custom-event-list">
                        <div class="fc-event-title">大会名：${title}</div>
                        <div class="fc-event-place">会場：${pref} ${place}</div>
                    </div>
                `;
                return { html: innerHtml };
            }
        },
        noEventsContent: function() {
            return '現在予定はありません。';
        },
        eventClick: function(info) {
            const url = info.event.extendedProps.url;
            if (url) {
                window.open(url, '_blank');
                info.jsEvent.preventDefault();
            }
        }
    });
    calendar.render();
});