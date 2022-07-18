var levels = [
  {
    "world": "Start",
    "klasse": [1,2],
    "type": "Zeiger einstellen",
    "levels": [
      { "label": "Stell die Uhr auf ein Uhr", startHour: 10, startMinute: 0, zielHour: "01", zielMinute: "00" },
      { "label": "Stell die Uhr auf 0 Uhr", startHour: 12, startMinute: 0, zielHour: "12", zielMinute: "00" }
    ]
  },
  {
    "world": "Halbe und viertel Stunden",
    "klasse": [2],
    "type": "Zeiger einstellen",
    "levels": [
      { "label": "Stell die Uhr auf 6:15 Uhr", zielHour: "6", zielMinute: "15" },
      { "label": "Stell die Uhr auf viertel nach 11 Uhr", zielHour: "11", zielMinute: "15" }
    ]
  },
  {
    "world": "Auf die Minute genaue Angaben",
    "klasse": [2,3],
    "type": "Zeiger einstellen",
    "levels": [
      { "label": "Stell die Uhr auf 1:20 Uhr", startHour: 12, startMinute: 0, zielHour: "01", zielMinute: "20" },
      { "label": "Stell die Uhr auf 14:20 Uhr", startHour: 12, startMinute: 0, zielHour: "14", zielMinute: "20" }
    ]
  },
  {
    "world": "Halbe und viertel Stunden relativ",
    "klasse": [2, 3],
    "type": "Zeiger einstellen",
    "levels": [
      { "label": "Stell die Uhr eine viertel Stunde zurück", startHour: 11, startMinute: 15, zielHour: "11", zielMinute: "00" },
      { "label": "Stell die Uhr eine dreiviertel Stunde zurück", startHour: 21, startMinute: 30, zielHour: "20", zielMinute: "45" }
    ]
  },
  {
    "world": "Halbe und viertel Stunden auf die Minute genau",
    "klasse": [2],
    "type": "Zeiger einstellen",
    "levels": [
      { "label": "Stell die Uhr eine viertel Stunde zurück", startHour: 11, startMinute: 25, zielHour: "11", zielMinute: "10" },
      { "label": "Stell die Uhr eine dreiviertel Stunde zurück", startHour: 21, startMinute: 53, zielHour: "21", zielMinute: "08" }
    ]
  },
  {
    "world": "auf die Minute genau vor und zurück",
    "klasse": [3],
    "type": "Zeiger einstellen",
    "levels": [
      { "label": "Stell die Uhr 37 Minuten vor", startHour: 14, startMinute: 37, zielHour: "15", zielMinute: "14" },
      { "label": "Stell die Uhr 43 Minuten vor", startHour: 3, startMinute: 48, zielHour: "04", zielMinute: "31" }
    ]
  }
];
