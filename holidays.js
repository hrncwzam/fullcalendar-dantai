document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    locale: 'ja',
    initialView: 'dayGridMonth',

    dayCellDidMount: function(info) {
      const date = info.date;

      // 祝日判定 → クラス追加のみ（祝日名は表示しない）
      if (JapaneseHolidays.isHoliday(date)) {
        info.el.classList.add('fc-day-holiday');
      }
    }
  });

  calendar.render();
});
