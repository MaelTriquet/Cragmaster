// echo "// DO NOT EDIT THID FILE" > grade.js; cat grade.header >> grade.js; curl https://www.thecrag.com/api/config/grade/system | jq '.data | [.[] | {label, id, grade: .grade | [.[] | {label, bandLevel}]}]' >> grade.js; echo ";" >> grade.js

var tcGrades = 
[
  {
    "label": "BAND",
    "id": 7510846,
    "grade": [
      {
        "label": "Beginner",
        "bandLevel": 1
      },
      {
        "label": "Intermediate",
        "bandLevel": 2
      },
      {
        "label": "Experienced",
        "bandLevel": 3
      },
      {
        "label": "Expert",
        "bandLevel": 4
      },
      {
        "label": "Elite",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "AU",
    "id": 7510852,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "1",
        "bandLevel": 1
      },
      {
        "label": "2",
        "bandLevel": 1
      },
      {
        "label": "3",
        "bandLevel": 1
      },
      {
        "label": "4",
        "bandLevel": 1
      },
      {
        "label": "5",
        "bandLevel": 1
      },
      {
        "label": "6",
        "bandLevel": 1
      },
      {
        "label": "7",
        "bandLevel": 1
      },
      {
        "label": "8",
        "bandLevel": 1
      },
      {
        "label": "9",
        "bandLevel": 1
      },
      {
        "label": "10",
        "bandLevel": 1
      },
      {
        "label": "11",
        "bandLevel": 1
      },
      {
        "label": "12",
        "bandLevel": 1
      },
      {
        "label": "13",
        "bandLevel": 2
      },
      {
        "label": "14",
        "bandLevel": 2
      },
      {
        "label": "15",
        "bandLevel": 2
      },
      {
        "label": "16",
        "bandLevel": 2
      },
      {
        "label": "17",
        "bandLevel": 2
      },
      {
        "label": "18",
        "bandLevel": 2
      },
      {
        "label": "19",
        "bandLevel": 3
      },
      {
        "label": "20",
        "bandLevel": 3
      },
      {
        "label": "21",
        "bandLevel": 3
      },
      {
        "label": "22",
        "bandLevel": 3
      },
      {
        "label": "23",
        "bandLevel": 3
      },
      {
        "label": "24",
        "bandLevel": 3
      },
      {
        "label": "25",
        "bandLevel": 4
      },
      {
        "label": "26",
        "bandLevel": 4
      },
      {
        "label": "27",
        "bandLevel": 4
      },
      {
        "label": "28",
        "bandLevel": 4
      },
      {
        "label": "29",
        "bandLevel": 4
      },
      {
        "label": "30",
        "bandLevel": 4
      },
      {
        "label": "31",
        "bandLevel": 4
      },
      {
        "label": "32",
        "bandLevel": 4
      },
      {
        "label": "33",
        "bandLevel": 5
      },
      {
        "label": "34",
        "bandLevel": 5
      },
      {
        "label": "35",
        "bandLevel": 5
      },
      {
        "label": "36",
        "bandLevel": 5
      },
      {
        "label": "37",
        "bandLevel": 5
      },
      {
        "label": "38",
        "bandLevel": 5
      },
      {
        "label": "39",
        "bandLevel": 5
      },
      {
        "label": "40",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "YDS",
    "id": 7510858,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "5.0",
        "bandLevel": 1
      },
      {
        "label": "5.1",
        "bandLevel": 1
      },
      {
        "label": "5.2",
        "bandLevel": 1
      },
      {
        "label": "5.3",
        "bandLevel": 1
      },
      {
        "label": "5.4",
        "bandLevel": 1
      },
      {
        "label": "5.5",
        "bandLevel": 1
      },
      {
        "label": "5.6",
        "bandLevel": 2
      },
      {
        "label": "5.7",
        "bandLevel": 2
      },
      {
        "label": "5.8",
        "bandLevel": 2
      },
      {
        "label": "5.9",
        "bandLevel": 2
      },
      {
        "label": "5.10a",
        "bandLevel": 2
      },
      {
        "label": "5.10b",
        "bandLevel": 3
      },
      {
        "label": "5.10c",
        "bandLevel": 3
      },
      {
        "label": "5.10d",
        "bandLevel": 3
      },
      {
        "label": "5.11a",
        "bandLevel": 3
      },
      {
        "label": "5.11b",
        "bandLevel": 3
      },
      {
        "label": "5.11c",
        "bandLevel": 3
      },
      {
        "label": "5.11d",
        "bandLevel": 3
      },
      {
        "label": "5.12a",
        "bandLevel": 3
      },
      {
        "label": "5.12b",
        "bandLevel": 4
      },
      {
        "label": "5.12c",
        "bandLevel": 4
      },
      {
        "label": "5.12d",
        "bandLevel": 4
      },
      {
        "label": "5.13a",
        "bandLevel": 4
      },
      {
        "label": "5.13b",
        "bandLevel": 4
      },
      {
        "label": "5.13c",
        "bandLevel": 4
      },
      {
        "label": "5.13d",
        "bandLevel": 4
      },
      {
        "label": "5.14a",
        "bandLevel": 4
      },
      {
        "label": "5.14b",
        "bandLevel": 5
      },
      {
        "label": "5.14c",
        "bandLevel": 5
      },
      {
        "label": "5.14d",
        "bandLevel": 5
      },
      {
        "label": "5.15a",
        "bandLevel": 5
      },
      {
        "label": "5.15b",
        "bandLevel": 5
      },
      {
        "label": "5.15c",
        "bandLevel": 5
      },
      {
        "label": "5.15d",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "YDS_ALT",
    "id": 7510864,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "5.0",
        "bandLevel": 1
      },
      {
        "label": "5.1",
        "bandLevel": 1
      },
      {
        "label": "5.2",
        "bandLevel": 1
      },
      {
        "label": "5.3",
        "bandLevel": 1
      },
      {
        "label": "5.4",
        "bandLevel": 1
      },
      {
        "label": "5.5",
        "bandLevel": 1
      },
      {
        "label": "5.6",
        "bandLevel": 2
      },
      {
        "label": "5.7",
        "bandLevel": 2
      },
      {
        "label": "5.8",
        "bandLevel": 2
      },
      {
        "label": "5.9",
        "bandLevel": 2
      },
      {
        "label": "5.10-",
        "bandLevel": 2
      },
      {
        "label": "5.10",
        "bandLevel": 2
      },
      {
        "label": "5.10+",
        "bandLevel": 3
      },
      {
        "label": "5.11-",
        "bandLevel": 3
      },
      {
        "label": "5.11",
        "bandLevel": 3
      },
      {
        "label": "5.11+",
        "bandLevel": 3
      },
      {
        "label": "5.12-",
        "bandLevel": 3
      },
      {
        "label": "5.12",
        "bandLevel": 3
      },
      {
        "label": "5.12+",
        "bandLevel": 4
      },
      {
        "label": "5.13-",
        "bandLevel": 4
      },
      {
        "label": "5.13",
        "bandLevel": 4
      },
      {
        "label": "5.13+",
        "bandLevel": 4
      },
      {
        "label": "5.14-",
        "bandLevel": 4
      },
      {
        "label": "5.14",
        "bandLevel": 4
      },
      {
        "label": "5.14+",
        "bandLevel": 5
      },
      {
        "label": "5.15-",
        "bandLevel": 5
      },
      {
        "label": "5.15",
        "bandLevel": 5
      },
      {
        "label": "5.15+",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "CLS",
    "id": 7510870,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "Class 1",
        "bandLevel": 1
      },
      {
        "label": "Class 2",
        "bandLevel": 1
      },
      {
        "label": "Class 3",
        "bandLevel": 1
      },
      {
        "label": "Class 4",
        "bandLevel": 1
      },
      {
        "label": "Class 5",
        "bandLevel": 1
      },
      {
        "label": "Class 6",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "NCCST",
    "id": 7510876,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "F1",
        "bandLevel": null
      },
      {
        "label": "F2",
        "bandLevel": null
      },
      {
        "label": "F3",
        "bandLevel": null
      },
      {
        "label": "F4",
        "bandLevel": 1
      },
      {
        "label": "F5",
        "bandLevel": 1
      },
      {
        "label": "F6",
        "bandLevel": 2
      },
      {
        "label": "F7",
        "bandLevel": 2
      },
      {
        "label": "F8",
        "bandLevel": 2
      },
      {
        "label": "F9",
        "bandLevel": 2
      },
      {
        "label": "F10",
        "bandLevel": 3
      },
      {
        "label": "F11",
        "bandLevel": 3
      },
      {
        "label": "F12",
        "bandLevel": 3
      },
      {
        "label": "F13",
        "bandLevel": 3
      },
      {
        "label": "F14",
        "bandLevel": 3
      },
      {
        "label": "F15",
        "bandLevel": 4
      },
      {
        "label": "F16",
        "bandLevel": 4
      }
    ]
  },
  {
    "label": "FR",
    "id": 7510882,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "1a",
        "bandLevel": 1
      },
      {
        "label": "1a+",
        "bandLevel": 1
      },
      {
        "label": "1b",
        "bandLevel": 1
      },
      {
        "label": "1b+",
        "bandLevel": 1
      },
      {
        "label": "1c",
        "bandLevel": 1
      },
      {
        "label": "1c+",
        "bandLevel": 1
      },
      {
        "label": "2a",
        "bandLevel": 1
      },
      {
        "label": "2a+",
        "bandLevel": 1
      },
      {
        "label": "2b",
        "bandLevel": 1
      },
      {
        "label": "2b+",
        "bandLevel": 1
      },
      {
        "label": "2c",
        "bandLevel": 1
      },
      {
        "label": "2c+",
        "bandLevel": 1
      },
      {
        "label": "3a",
        "bandLevel": 1
      },
      {
        "label": "3a+",
        "bandLevel": 1
      },
      {
        "label": "3b",
        "bandLevel": 1
      },
      {
        "label": "3b+",
        "bandLevel": 1
      },
      {
        "label": "3c",
        "bandLevel": 1
      },
      {
        "label": "3c+",
        "bandLevel": 1
      },
      {
        "label": "4a",
        "bandLevel": 2
      },
      {
        "label": "4a+",
        "bandLevel": 2
      },
      {
        "label": "4b",
        "bandLevel": 2
      },
      {
        "label": "4b+",
        "bandLevel": 2
      },
      {
        "label": "4c",
        "bandLevel": 2
      },
      {
        "label": "4c+",
        "bandLevel": 2
      },
      {
        "label": "5a",
        "bandLevel": 2
      },
      {
        "label": "5a+",
        "bandLevel": 2
      },
      {
        "label": "5b",
        "bandLevel": 2
      },
      {
        "label": "5b+",
        "bandLevel": 2
      },
      {
        "label": "5c",
        "bandLevel": 2
      },
      {
        "label": "5c+",
        "bandLevel": 2
      },
      {
        "label": "6a",
        "bandLevel": 2
      },
      {
        "label": "6a+",
        "bandLevel": 3
      },
      {
        "label": "6b",
        "bandLevel": 3
      },
      {
        "label": "6b+",
        "bandLevel": 3
      },
      {
        "label": "6c",
        "bandLevel": 3
      },
      {
        "label": "6c+",
        "bandLevel": 3
      },
      {
        "label": "7a",
        "bandLevel": 3
      },
      {
        "label": "7a+",
        "bandLevel": 3
      },
      {
        "label": "7b",
        "bandLevel": 4
      },
      {
        "label": "7b+",
        "bandLevel": 4
      },
      {
        "label": "7c",
        "bandLevel": 4
      },
      {
        "label": "7c+",
        "bandLevel": 4
      },
      {
        "label": "8a",
        "bandLevel": 4
      },
      {
        "label": "8a+",
        "bandLevel": 4
      },
      {
        "label": "8b",
        "bandLevel": 4
      },
      {
        "label": "8b+",
        "bandLevel": 4
      },
      {
        "label": "8c",
        "bandLevel": 5
      },
      {
        "label": "8c+",
        "bandLevel": 5
      },
      {
        "label": "9a",
        "bandLevel": 5
      },
      {
        "label": "9a+",
        "bandLevel": 5
      },
      {
        "label": "9b",
        "bandLevel": 5
      },
      {
        "label": "9b+",
        "bandLevel": 5
      },
      {
        "label": "9c",
        "bandLevel": 5
      },
      {
        "label": "9c+",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "FR_ALT",
    "id": 7510888,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "1",
        "bandLevel": 1
      },
      {
        "label": "1+",
        "bandLevel": 1
      },
      {
        "label": "2",
        "bandLevel": 1
      },
      {
        "label": "2+",
        "bandLevel": 1
      },
      {
        "label": "3",
        "bandLevel": 1
      },
      {
        "label": "3+",
        "bandLevel": 1
      },
      {
        "label": "4",
        "bandLevel": 2
      },
      {
        "label": "4+",
        "bandLevel": 2
      },
      {
        "label": "5",
        "bandLevel": 2
      },
      {
        "label": "5+",
        "bandLevel": 2
      },
      {
        "label": "6",
        "bandLevel": 2
      },
      {
        "label": "6+",
        "bandLevel": 3
      },
      {
        "label": "7",
        "bandLevel": 3
      },
      {
        "label": "7+",
        "bandLevel": 4
      },
      {
        "label": "8",
        "bandLevel": 4
      },
      {
        "label": "8+",
        "bandLevel": 4
      },
      {
        "label": "9",
        "bandLevel": null
      },
      {
        "label": "9+",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "UK",
    "id": 7510894,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "E",
        "bandLevel": 1
      },
      {
        "label": "M",
        "bandLevel": 1
      },
      {
        "label": "MD",
        "bandLevel": 1
      },
      {
        "label": "D",
        "bandLevel": 1
      },
      {
        "label": "HD",
        "bandLevel": 1
      },
      {
        "label": "MVD",
        "bandLevel": 1
      },
      {
        "label": "VD",
        "bandLevel": 1
      },
      {
        "label": "HVD",
        "bandLevel": 1
      },
      {
        "label": "MS",
        "bandLevel": 2
      },
      {
        "label": "S",
        "bandLevel": 2
      },
      {
        "label": "HS",
        "bandLevel": 2
      },
      {
        "label": "MVS",
        "bandLevel": 2
      },
      {
        "label": "VS",
        "bandLevel": 2
      },
      {
        "label": "HVS",
        "bandLevel": 2
      },
      {
        "label": "E1",
        "bandLevel": 3
      },
      {
        "label": "E2",
        "bandLevel": 3
      },
      {
        "label": "E3",
        "bandLevel": 3
      },
      {
        "label": "E4",
        "bandLevel": 3
      },
      {
        "label": "E5",
        "bandLevel": 4
      },
      {
        "label": "E6",
        "bandLevel": 4
      },
      {
        "label": "E7",
        "bandLevel": 4
      },
      {
        "label": "E8",
        "bandLevel": 4
      },
      {
        "label": "E9",
        "bandLevel": 5
      },
      {
        "label": "E10",
        "bandLevel": 5
      },
      {
        "label": "E11",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "UKT",
    "id": 7510900,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "1a",
        "bandLevel": 1
      },
      {
        "label": "1b",
        "bandLevel": 1
      },
      {
        "label": "1c",
        "bandLevel": 1
      },
      {
        "label": "2a",
        "bandLevel": 1
      },
      {
        "label": "2b",
        "bandLevel": 1
      },
      {
        "label": "2c",
        "bandLevel": 1
      },
      {
        "label": "3a",
        "bandLevel": 1
      },
      {
        "label": "3b",
        "bandLevel": 1
      },
      {
        "label": "3c",
        "bandLevel": 1
      },
      {
        "label": "4a",
        "bandLevel": 1
      },
      {
        "label": "4b",
        "bandLevel": 2
      },
      {
        "label": "4c",
        "bandLevel": 2
      },
      {
        "label": "5a",
        "bandLevel": 2
      },
      {
        "label": "5b",
        "bandLevel": 3
      },
      {
        "label": "5c",
        "bandLevel": 3
      },
      {
        "label": "6a",
        "bandLevel": 3
      },
      {
        "label": "6b",
        "bandLevel": 4
      },
      {
        "label": "6c",
        "bandLevel": 4
      },
      {
        "label": "7a",
        "bandLevel": 4
      },
      {
        "label": "7b",
        "bandLevel": 5
      },
      {
        "label": "7c",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "UIAA",
    "id": 7510906,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "1-",
        "bandLevel": 1
      },
      {
        "label": "1",
        "bandLevel": 1
      },
      {
        "label": "1+",
        "bandLevel": 1
      },
      {
        "label": "2-",
        "bandLevel": 1
      },
      {
        "label": "2",
        "bandLevel": 1
      },
      {
        "label": "2+",
        "bandLevel": 1
      },
      {
        "label": "3-",
        "bandLevel": 1
      },
      {
        "label": "3",
        "bandLevel": 1
      },
      {
        "label": "3+",
        "bandLevel": 1
      },
      {
        "label": "4-",
        "bandLevel": 1
      },
      {
        "label": "4",
        "bandLevel": 1
      },
      {
        "label": "4+",
        "bandLevel": 2
      },
      {
        "label": "5-",
        "bandLevel": 2
      },
      {
        "label": "5",
        "bandLevel": 2
      },
      {
        "label": "5+",
        "bandLevel": 2
      },
      {
        "label": "6-",
        "bandLevel": 2
      },
      {
        "label": "6",
        "bandLevel": 2
      },
      {
        "label": "6+",
        "bandLevel": 2
      },
      {
        "label": "7-",
        "bandLevel": 3
      },
      {
        "label": "7",
        "bandLevel": 3
      },
      {
        "label": "7+",
        "bandLevel": 3
      },
      {
        "label": "8-",
        "bandLevel": 3
      },
      {
        "label": "8",
        "bandLevel": 3
      },
      {
        "label": "8+",
        "bandLevel": 3
      },
      {
        "label": "9-",
        "bandLevel": 4
      },
      {
        "label": "9",
        "bandLevel": 4
      },
      {
        "label": "9+",
        "bandLevel": 4
      },
      {
        "label": "10-",
        "bandLevel": 4
      },
      {
        "label": "10",
        "bandLevel": 4
      },
      {
        "label": "10+",
        "bandLevel": 4
      },
      {
        "label": "11-",
        "bandLevel": 5
      },
      {
        "label": "11",
        "bandLevel": 5
      },
      {
        "label": "11+",
        "bandLevel": 5
      },
      {
        "label": "12-",
        "bandLevel": 5
      },
      {
        "label": "12",
        "bandLevel": 5
      },
      {
        "label": "12+",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "SA",
    "id": 7510912,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "1",
        "bandLevel": 1
      },
      {
        "label": "2",
        "bandLevel": 1
      },
      {
        "label": "3",
        "bandLevel": 1
      },
      {
        "label": "4",
        "bandLevel": 1
      },
      {
        "label": "5",
        "bandLevel": 1
      },
      {
        "label": "6",
        "bandLevel": 1
      },
      {
        "label": "7",
        "bandLevel": 1
      },
      {
        "label": "8",
        "bandLevel": 1
      },
      {
        "label": "9",
        "bandLevel": 1
      },
      {
        "label": "10",
        "bandLevel": 1
      },
      {
        "label": "11",
        "bandLevel": 1
      },
      {
        "label": "12",
        "bandLevel": 1
      },
      {
        "label": "13",
        "bandLevel": 2
      },
      {
        "label": "14",
        "bandLevel": 2
      },
      {
        "label": "15",
        "bandLevel": 2
      },
      {
        "label": "16",
        "bandLevel": 2
      },
      {
        "label": "17",
        "bandLevel": 2
      },
      {
        "label": "18",
        "bandLevel": 2
      },
      {
        "label": "19",
        "bandLevel": 2
      },
      {
        "label": "20",
        "bandLevel": 3
      },
      {
        "label": "21",
        "bandLevel": 3
      },
      {
        "label": "22",
        "bandLevel": 3
      },
      {
        "label": "23",
        "bandLevel": 3
      },
      {
        "label": "24",
        "bandLevel": 3
      },
      {
        "label": "25",
        "bandLevel": 3
      },
      {
        "label": "26",
        "bandLevel": 3
      },
      {
        "label": "27",
        "bandLevel": 4
      },
      {
        "label": "28",
        "bandLevel": 4
      },
      {
        "label": "29",
        "bandLevel": 4
      },
      {
        "label": "30",
        "bandLevel": 4
      },
      {
        "label": "31",
        "bandLevel": 4
      },
      {
        "label": "32",
        "bandLevel": 4
      },
      {
        "label": "33",
        "bandLevel": 4
      },
      {
        "label": "34",
        "bandLevel": 4
      },
      {
        "label": "35",
        "bandLevel": 5
      },
      {
        "label": "36",
        "bandLevel": 5
      },
      {
        "label": "37",
        "bandLevel": 5
      },
      {
        "label": "38",
        "bandLevel": 5
      },
      {
        "label": "39",
        "bandLevel": 5
      },
      {
        "label": "40",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "OLDSA",
    "id": 7510918,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "A1",
        "bandLevel": 1
      },
      {
        "label": "A2",
        "bandLevel": 1
      },
      {
        "label": "A3",
        "bandLevel": 1
      },
      {
        "label": "B1",
        "bandLevel": 1
      },
      {
        "label": "B2",
        "bandLevel": 1
      },
      {
        "label": "B3",
        "bandLevel": 1
      },
      {
        "label": "C1",
        "bandLevel": 1
      },
      {
        "label": "C2",
        "bandLevel": 1
      },
      {
        "label": "C3",
        "bandLevel": 1
      },
      {
        "label": "D1",
        "bandLevel": 1
      },
      {
        "label": "D2",
        "bandLevel": 1
      },
      {
        "label": "D3",
        "bandLevel": 1
      },
      {
        "label": "E1",
        "bandLevel": 1
      },
      {
        "label": "E2",
        "bandLevel": 1
      },
      {
        "label": "E3",
        "bandLevel": 1
      },
      {
        "label": "F1",
        "bandLevel": 1
      },
      {
        "label": "F2",
        "bandLevel": 2
      },
      {
        "label": "F3",
        "bandLevel": 2
      },
      {
        "label": "G1",
        "bandLevel": 2
      },
      {
        "label": "G2",
        "bandLevel": 2
      },
      {
        "label": "G3",
        "bandLevel": 3
      },
      {
        "label": "H1",
        "bandLevel": 3
      },
      {
        "label": "H2",
        "bandLevel": 3
      },
      {
        "label": "H3",
        "bandLevel": 3
      },
      {
        "label": "I1",
        "bandLevel": 4
      },
      {
        "label": "I2",
        "bandLevel": 4
      },
      {
        "label": "I3",
        "bandLevel": 4
      },
      {
        "label": "J1",
        "bandLevel": 4
      },
      {
        "label": "J2",
        "bandLevel": 5
      },
      {
        "label": "J3",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "OLDSA_ALT",
    "id": 7510924,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "A",
        "bandLevel": 1
      },
      {
        "label": "A+",
        "bandLevel": 1
      },
      {
        "label": "B",
        "bandLevel": 1
      },
      {
        "label": "B+",
        "bandLevel": 1
      },
      {
        "label": "C",
        "bandLevel": 1
      },
      {
        "label": "C+",
        "bandLevel": 1
      },
      {
        "label": "D",
        "bandLevel": 1
      },
      {
        "label": "D+",
        "bandLevel": 1
      },
      {
        "label": "E",
        "bandLevel": 1
      },
      {
        "label": "E+",
        "bandLevel": 1
      },
      {
        "label": "F",
        "bandLevel": 1
      },
      {
        "label": "F+",
        "bandLevel": 2
      },
      {
        "label": "G",
        "bandLevel": 2
      },
      {
        "label": "G+",
        "bandLevel": 2
      },
      {
        "label": "H",
        "bandLevel": 3
      },
      {
        "label": "H+",
        "bandLevel": 3
      },
      {
        "label": "I",
        "bandLevel": 4
      },
      {
        "label": "I+",
        "bandLevel": 4
      },
      {
        "label": "J",
        "bandLevel": null
      },
      {
        "label": "J+",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "SX",
    "id": 7510930,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "I",
        "bandLevel": 1
      },
      {
        "label": "II",
        "bandLevel": 1
      },
      {
        "label": "III",
        "bandLevel": 1
      },
      {
        "label": "IV",
        "bandLevel": 2
      },
      {
        "label": "V",
        "bandLevel": 2
      },
      {
        "label": "VI",
        "bandLevel": 2
      },
      {
        "label": "VIIa",
        "bandLevel": 2
      },
      {
        "label": "VIIb",
        "bandLevel": 2
      },
      {
        "label": "VIIc",
        "bandLevel": 2
      },
      {
        "label": "VIIIa",
        "bandLevel": 3
      },
      {
        "label": "VIIIb",
        "bandLevel": 3
      },
      {
        "label": "VIIIc",
        "bandLevel": 3
      },
      {
        "label": "IXa",
        "bandLevel": 3
      },
      {
        "label": "IXb",
        "bandLevel": 3
      },
      {
        "label": "IXc",
        "bandLevel": 3
      },
      {
        "label": "Xa",
        "bandLevel": 4
      },
      {
        "label": "Xb",
        "bandLevel": 4
      },
      {
        "label": "Xc",
        "bandLevel": 4
      },
      {
        "label": "XIa",
        "bandLevel": 4
      },
      {
        "label": "XIb",
        "bandLevel": 4
      },
      {
        "label": "XIc",
        "bandLevel": 4
      },
      {
        "label": "XIIa",
        "bandLevel": 5
      },
      {
        "label": "XIIb",
        "bandLevel": 5
      },
      {
        "label": "XIIc",
        "bandLevel": 5
      },
      {
        "label": "XIIIa",
        "bandLevel": 5
      },
      {
        "label": "XIIIb",
        "bandLevel": 5
      },
      {
        "label": "XIIIc",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "SX_ALT",
    "id": 7510936,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "I-",
        "bandLevel": 1
      },
      {
        "label": "I",
        "bandLevel": 1
      },
      {
        "label": "I+",
        "bandLevel": 1
      },
      {
        "label": "II-",
        "bandLevel": 1
      },
      {
        "label": "II",
        "bandLevel": 1
      },
      {
        "label": "II+",
        "bandLevel": 1
      },
      {
        "label": "III-",
        "bandLevel": 1
      },
      {
        "label": "III",
        "bandLevel": 1
      },
      {
        "label": "III+",
        "bandLevel": 1
      },
      {
        "label": "IV-",
        "bandLevel": 2
      },
      {
        "label": "IV",
        "bandLevel": 2
      },
      {
        "label": "IV+",
        "bandLevel": 2
      },
      {
        "label": "V-",
        "bandLevel": 2
      },
      {
        "label": "V",
        "bandLevel": 2
      },
      {
        "label": "V+",
        "bandLevel": 2
      },
      {
        "label": "VI-",
        "bandLevel": 2
      },
      {
        "label": "VI",
        "bandLevel": 2
      },
      {
        "label": "VI+",
        "bandLevel": 2
      },
      {
        "label": "VII-",
        "bandLevel": 2
      },
      {
        "label": "VII",
        "bandLevel": 2
      },
      {
        "label": "VII+",
        "bandLevel": 2
      },
      {
        "label": "VIII-",
        "bandLevel": 3
      },
      {
        "label": "VIII",
        "bandLevel": 3
      },
      {
        "label": "VIII+",
        "bandLevel": 3
      },
      {
        "label": "IX-",
        "bandLevel": 3
      },
      {
        "label": "IX",
        "bandLevel": 3
      },
      {
        "label": "IX+",
        "bandLevel": 3
      },
      {
        "label": "X-",
        "bandLevel": 4
      },
      {
        "label": "X",
        "bandLevel": 4
      },
      {
        "label": "X+",
        "bandLevel": 4
      },
      {
        "label": "XI-",
        "bandLevel": 4
      },
      {
        "label": "XI",
        "bandLevel": 4
      },
      {
        "label": "XI+",
        "bandLevel": 4
      },
      {
        "label": "XII-",
        "bandLevel": 5
      },
      {
        "label": "XII",
        "bandLevel": 5
      },
      {
        "label": "XII+",
        "bandLevel": 5
      },
      {
        "label": "XIII-",
        "bandLevel": 5
      },
      {
        "label": "XIII",
        "bandLevel": 5
      },
      {
        "label": "XIII+",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "FIN",
    "id": 278809396,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "1-",
        "bandLevel": 1
      },
      {
        "label": "1",
        "bandLevel": 1
      },
      {
        "label": "1+",
        "bandLevel": 1
      },
      {
        "label": "2-",
        "bandLevel": 1
      },
      {
        "label": "2",
        "bandLevel": 1
      },
      {
        "label": "2+",
        "bandLevel": 1
      },
      {
        "label": "3-",
        "bandLevel": 1
      },
      {
        "label": "3",
        "bandLevel": 1
      },
      {
        "label": "3+",
        "bandLevel": 1
      },
      {
        "label": "4-",
        "bandLevel": 1
      },
      {
        "label": "4",
        "bandLevel": 1
      },
      {
        "label": "4+",
        "bandLevel": 2
      },
      {
        "label": "5-",
        "bandLevel": 2
      },
      {
        "label": "5",
        "bandLevel": 2
      },
      {
        "label": "5+",
        "bandLevel": 2
      },
      {
        "label": "6-",
        "bandLevel": 2
      },
      {
        "label": "6",
        "bandLevel": 3
      },
      {
        "label": "6+",
        "bandLevel": 3
      },
      {
        "label": "7-",
        "bandLevel": 3
      },
      {
        "label": "7",
        "bandLevel": 3
      },
      {
        "label": "7+",
        "bandLevel": 3
      },
      {
        "label": "8-",
        "bandLevel": 4
      },
      {
        "label": "8",
        "bandLevel": 4
      },
      {
        "label": "8+",
        "bandLevel": 4
      },
      {
        "label": "9-",
        "bandLevel": 4
      },
      {
        "label": "9",
        "bandLevel": 4
      },
      {
        "label": "9+",
        "bandLevel": 4
      },
      {
        "label": "10-",
        "bandLevel": 4
      },
      {
        "label": "10",
        "bandLevel": 4
      },
      {
        "label": "10+",
        "bandLevel": 4
      },
      {
        "label": "11-",
        "bandLevel": 5
      },
      {
        "label": "11",
        "bandLevel": 5
      },
      {
        "label": "11+",
        "bandLevel": 5
      },
      {
        "label": "12-",
        "bandLevel": 5
      },
      {
        "label": "12",
        "bandLevel": 5
      },
      {
        "label": "12+",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "NWG",
    "id": 278809402,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "1-",
        "bandLevel": 1
      },
      {
        "label": "1",
        "bandLevel": 1
      },
      {
        "label": "1+",
        "bandLevel": 1
      },
      {
        "label": "2-",
        "bandLevel": 1
      },
      {
        "label": "2",
        "bandLevel": 1
      },
      {
        "label": "2+",
        "bandLevel": 1
      },
      {
        "label": "3-",
        "bandLevel": 1
      },
      {
        "label": "3",
        "bandLevel": 1
      },
      {
        "label": "3+",
        "bandLevel": 1
      },
      {
        "label": "4-",
        "bandLevel": 1
      },
      {
        "label": "4",
        "bandLevel": 1
      },
      {
        "label": "4+",
        "bandLevel": 2
      },
      {
        "label": "5-",
        "bandLevel": 2
      },
      {
        "label": "5",
        "bandLevel": 2
      },
      {
        "label": "5+",
        "bandLevel": 2
      },
      {
        "label": "6-",
        "bandLevel": 2
      },
      {
        "label": "6",
        "bandLevel": 3
      },
      {
        "label": "6+",
        "bandLevel": 3
      },
      {
        "label": "7-",
        "bandLevel": 3
      },
      {
        "label": "7",
        "bandLevel": 3
      },
      {
        "label": "7+",
        "bandLevel": 3
      },
      {
        "label": "8-",
        "bandLevel": 3
      },
      {
        "label": "8",
        "bandLevel": 4
      },
      {
        "label": "8+",
        "bandLevel": 4
      },
      {
        "label": "9-",
        "bandLevel": 4
      },
      {
        "label": "9",
        "bandLevel": 4
      },
      {
        "label": "9+",
        "bandLevel": 4
      },
      {
        "label": "10-",
        "bandLevel": 5
      },
      {
        "label": "10",
        "bandLevel": 5
      },
      {
        "label": "10+",
        "bandLevel": 5
      },
      {
        "label": "11-",
        "bandLevel": 5
      },
      {
        "label": "11",
        "bandLevel": 5
      },
      {
        "label": "11+",
        "bandLevel": 5
      },
      {
        "label": "12-",
        "bandLevel": 5
      },
      {
        "label": "12",
        "bandLevel": 5
      },
      {
        "label": "12+",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "POL",
    "id": 285768805,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "I-",
        "bandLevel": 1
      },
      {
        "label": "I",
        "bandLevel": 1
      },
      {
        "label": "I+",
        "bandLevel": 1
      },
      {
        "label": "II-",
        "bandLevel": 1
      },
      {
        "label": "II",
        "bandLevel": 1
      },
      {
        "label": "II+",
        "bandLevel": 1
      },
      {
        "label": "III-",
        "bandLevel": 1
      },
      {
        "label": "III",
        "bandLevel": 1
      },
      {
        "label": "III+",
        "bandLevel": 1
      },
      {
        "label": "IV-",
        "bandLevel": 1
      },
      {
        "label": "IV",
        "bandLevel": 1
      },
      {
        "label": "IV+",
        "bandLevel": 2
      },
      {
        "label": "V-",
        "bandLevel": 2
      },
      {
        "label": "V",
        "bandLevel": 2
      },
      {
        "label": "V+",
        "bandLevel": 2
      },
      {
        "label": "VI-",
        "bandLevel": 2
      },
      {
        "label": "VI",
        "bandLevel": 2
      },
      {
        "label": "VI+",
        "bandLevel": 3
      },
      {
        "label": "VI.1",
        "bandLevel": 3
      },
      {
        "label": "VI.1+",
        "bandLevel": 3
      },
      {
        "label": "VI.2",
        "bandLevel": 3
      },
      {
        "label": "VI.2+",
        "bandLevel": 3
      },
      {
        "label": "VI.3",
        "bandLevel": 3
      },
      {
        "label": "VI.3+",
        "bandLevel": 3
      },
      {
        "label": "VI.4",
        "bandLevel": 4
      },
      {
        "label": "VI.4+",
        "bandLevel": 4
      },
      {
        "label": "VI.5",
        "bandLevel": 4
      },
      {
        "label": "VI.5+",
        "bandLevel": 4
      },
      {
        "label": "VI.6",
        "bandLevel": 4
      },
      {
        "label": "VI.6+",
        "bandLevel": 4
      },
      {
        "label": "VI.7",
        "bandLevel": 5
      },
      {
        "label": "VI.7+",
        "bandLevel": 5
      },
      {
        "label": "VI.8",
        "bandLevel": 5
      },
      {
        "label": "VI.8+",
        "bandLevel": 5
      },
      {
        "label": "VI.9",
        "bandLevel": 5
      },
      {
        "label": "VI.9+",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "BRZ",
    "id": 343015843,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "I",
        "bandLevel": 1
      },
      {
        "label": "Isup",
        "bandLevel": 1
      },
      {
        "label": "II",
        "bandLevel": 1
      },
      {
        "label": "IIsup",
        "bandLevel": 1
      },
      {
        "label": "III",
        "bandLevel": 1
      },
      {
        "label": "IIIsup",
        "bandLevel": 2
      },
      {
        "label": "IV",
        "bandLevel": 2
      },
      {
        "label": "IVsup",
        "bandLevel": 2
      },
      {
        "label": "V",
        "bandLevel": 2
      },
      {
        "label": "Vsup",
        "bandLevel": 3
      },
      {
        "label": "VI",
        "bandLevel": 3
      },
      {
        "label": "VIsup",
        "bandLevel": 3
      },
      {
        "label": "VIIa",
        "bandLevel": 3
      },
      {
        "label": "VIIb",
        "bandLevel": 3
      },
      {
        "label": "VIIc",
        "bandLevel": 3
      },
      {
        "label": "VIIIa",
        "bandLevel": 3
      },
      {
        "label": "VIIIb",
        "bandLevel": 4
      },
      {
        "label": "VIIIc",
        "bandLevel": 4
      },
      {
        "label": "IXa",
        "bandLevel": 4
      },
      {
        "label": "IXb",
        "bandLevel": 4
      },
      {
        "label": "IXc",
        "bandLevel": 4
      },
      {
        "label": "Xa",
        "bandLevel": 4
      },
      {
        "label": "Xb",
        "bandLevel": 4
      },
      {
        "label": "Xc",
        "bandLevel": 4
      },
      {
        "label": "XIa",
        "bandLevel": 5
      },
      {
        "label": "XIb",
        "bandLevel": 5
      },
      {
        "label": "XIc",
        "bandLevel": 5
      },
      {
        "label": "XIIa",
        "bandLevel": 5
      },
      {
        "label": "XIIb",
        "bandLevel": 5
      },
      {
        "label": "XIIc",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "BRZ_DEG",
    "id": 343015849,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "1°",
        "bandLevel": null
      },
      {
        "label": "2°",
        "bandLevel": null
      },
      {
        "label": "3°",
        "bandLevel": null
      },
      {
        "label": "4°",
        "bandLevel": null
      },
      {
        "label": "5°",
        "bandLevel": null
      },
      {
        "label": "6°",
        "bandLevel": null
      },
      {
        "label": "7°",
        "bandLevel": null
      },
      {
        "label": "8°",
        "bandLevel": null
      },
      {
        "label": "9°",
        "bandLevel": null
      },
      {
        "label": "10°",
        "bandLevel": null
      },
      {
        "label": "11°",
        "bandLevel": null
      },
      {
        "label": "12°",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "AUAID",
    "id": 7510942,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "Ac",
        "bandLevel": null
      },
      {
        "label": "M0",
        "bandLevel": 1
      },
      {
        "label": "M1",
        "bandLevel": 1
      },
      {
        "label": "M2",
        "bandLevel": 1
      },
      {
        "label": "M3",
        "bandLevel": 2
      },
      {
        "label": "M4",
        "bandLevel": 2
      },
      {
        "label": "M5",
        "bandLevel": 2
      },
      {
        "label": "M6",
        "bandLevel": 3
      },
      {
        "label": "M7",
        "bandLevel": 3
      },
      {
        "label": "M8",
        "bandLevel": 4
      },
      {
        "label": "M9",
        "bandLevel": 4
      },
      {
        "label": "M10",
        "bandLevel": 5
      },
      {
        "label": "M11",
        "bandLevel": 5
      },
      {
        "label": "M12",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "AID",
    "id": 7510948,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "Ac",
        "bandLevel": null
      },
      {
        "label": "A0",
        "bandLevel": 1
      },
      {
        "label": "A0+",
        "bandLevel": 1
      },
      {
        "label": "A1",
        "bandLevel": 1
      },
      {
        "label": "A1+",
        "bandLevel": 2
      },
      {
        "label": "A2",
        "bandLevel": 2
      },
      {
        "label": "A2+",
        "bandLevel": 2
      },
      {
        "label": "A3",
        "bandLevel": 3
      },
      {
        "label": "A3+",
        "bandLevel": 3
      },
      {
        "label": "A4",
        "bandLevel": 4
      },
      {
        "label": "A4+",
        "bandLevel": 4
      },
      {
        "label": "A5",
        "bandLevel": 5
      },
      {
        "label": "A5+",
        "bandLevel": 5
      },
      {
        "label": "A6",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "AIDC",
    "id": 7510954,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "Ac",
        "bandLevel": null
      },
      {
        "label": "C0",
        "bandLevel": 1
      },
      {
        "label": "C0+",
        "bandLevel": 1
      },
      {
        "label": "C1",
        "bandLevel": 1
      },
      {
        "label": "C1+",
        "bandLevel": 2
      },
      {
        "label": "C2",
        "bandLevel": 2
      },
      {
        "label": "C2+",
        "bandLevel": 2
      },
      {
        "label": "C3",
        "bandLevel": 3
      },
      {
        "label": "C3+",
        "bandLevel": 3
      },
      {
        "label": "C4",
        "bandLevel": 4
      },
      {
        "label": "C4+",
        "bandLevel": 4
      },
      {
        "label": "C5",
        "bandLevel": 5
      },
      {
        "label": "C5+",
        "bandLevel": 5
      },
      {
        "label": "C6",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "BLDV",
    "id": 7510960,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "VB-",
        "bandLevel": 1
      },
      {
        "label": "VB",
        "bandLevel": 1
      },
      {
        "label": "VB+",
        "bandLevel": 1
      },
      {
        "label": "V0-",
        "bandLevel": 2
      },
      {
        "label": "V0",
        "bandLevel": 2
      },
      {
        "label": "V0+",
        "bandLevel": 2
      },
      {
        "label": "V1",
        "bandLevel": 3
      },
      {
        "label": "V2",
        "bandLevel": 3
      },
      {
        "label": "V3",
        "bandLevel": 3
      },
      {
        "label": "V4",
        "bandLevel": 3
      },
      {
        "label": "V5",
        "bandLevel": 4
      },
      {
        "label": "V6",
        "bandLevel": 4
      },
      {
        "label": "V7",
        "bandLevel": 4
      },
      {
        "label": "V8",
        "bandLevel": 4
      },
      {
        "label": "V9",
        "bandLevel": 4
      },
      {
        "label": "V10",
        "bandLevel": 4
      },
      {
        "label": "V11",
        "bandLevel": 5
      },
      {
        "label": "V12",
        "bandLevel": 5
      },
      {
        "label": "V13",
        "bandLevel": 5
      },
      {
        "label": "V14",
        "bandLevel": 5
      },
      {
        "label": "V15",
        "bandLevel": 5
      },
      {
        "label": "V16",
        "bandLevel": 5
      },
      {
        "label": "V17",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "BLDB",
    "id": 7510966,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "B5.0",
        "bandLevel": null
      },
      {
        "label": "B5.1",
        "bandLevel": null
      },
      {
        "label": "B5.2",
        "bandLevel": null
      },
      {
        "label": "B5.3",
        "bandLevel": null
      },
      {
        "label": "B5.4",
        "bandLevel": null
      },
      {
        "label": "B5.5",
        "bandLevel": null
      },
      {
        "label": "B5.6",
        "bandLevel": 2
      },
      {
        "label": "B5.7",
        "bandLevel": 2
      },
      {
        "label": "B5.8",
        "bandLevel": 2
      },
      {
        "label": "B5.9",
        "bandLevel": 2
      },
      {
        "label": "B5.10",
        "bandLevel": 2
      },
      {
        "label": "B5.10+",
        "bandLevel": 3
      },
      {
        "label": "B1-",
        "bandLevel": 3
      },
      {
        "label": "B1",
        "bandLevel": 3
      },
      {
        "label": "B1+",
        "bandLevel": 3
      },
      {
        "label": "B2-",
        "bandLevel": 4
      },
      {
        "label": "B2",
        "bandLevel": 4
      },
      {
        "label": "B2+",
        "bandLevel": 4
      },
      {
        "label": "B3",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "BLDS",
    "id": 7510972,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "S1-",
        "bandLevel": 3
      },
      {
        "label": "S1",
        "bandLevel": 3
      },
      {
        "label": "S1+",
        "bandLevel": 3
      },
      {
        "label": "S2-",
        "bandLevel": 3
      },
      {
        "label": "S2",
        "bandLevel": 3
      },
      {
        "label": "S2+",
        "bandLevel": 3
      },
      {
        "label": "S3-",
        "bandLevel": 3
      },
      {
        "label": "S3",
        "bandLevel": 3
      },
      {
        "label": "S3+",
        "bandLevel": 4
      },
      {
        "label": "S4-",
        "bandLevel": 4
      },
      {
        "label": "S4",
        "bandLevel": 4
      },
      {
        "label": "S4+",
        "bandLevel": 4
      },
      {
        "label": "S5-",
        "bandLevel": 4
      },
      {
        "label": "S5",
        "bandLevel": 4
      },
      {
        "label": "S5+",
        "bandLevel": 4
      },
      {
        "label": "S6-",
        "bandLevel": 4
      },
      {
        "label": "S6",
        "bandLevel": 5
      },
      {
        "label": "S6+",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "BLDP",
    "id": 7510978,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "P0",
        "bandLevel": 2
      },
      {
        "label": "P1",
        "bandLevel": 2
      },
      {
        "label": "P2",
        "bandLevel": 2
      },
      {
        "label": "P3",
        "bandLevel": 2
      },
      {
        "label": "P4",
        "bandLevel": 3
      },
      {
        "label": "P5",
        "bandLevel": 3
      },
      {
        "label": "P6",
        "bandLevel": 3
      },
      {
        "label": "P7",
        "bandLevel": 3
      },
      {
        "label": "P8",
        "bandLevel": 4
      },
      {
        "label": "P9",
        "bandLevel": 4
      },
      {
        "label": "P10",
        "bandLevel": 4
      },
      {
        "label": "P11",
        "bandLevel": 4
      },
      {
        "label": "P12",
        "bandLevel": 5
      },
      {
        "label": "P13",
        "bandLevel": 5
      },
      {
        "label": "P14",
        "bandLevel": 5
      },
      {
        "label": "P15",
        "bandLevel": 5
      },
      {
        "label": "P16",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "BLDJT",
    "id": 7510984,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "A-",
        "bandLevel": 3
      },
      {
        "label": "A",
        "bandLevel": 3
      },
      {
        "label": "A+",
        "bandLevel": 3
      },
      {
        "label": "B-",
        "bandLevel": 3
      },
      {
        "label": "B",
        "bandLevel": 3
      },
      {
        "label": "B+",
        "bandLevel": 4
      },
      {
        "label": "C-",
        "bandLevel": 4
      },
      {
        "label": "C",
        "bandLevel": 4
      },
      {
        "label": "C+",
        "bandLevel": 4
      },
      {
        "label": "D-",
        "bandLevel": 4
      },
      {
        "label": "D",
        "bandLevel": 5
      },
      {
        "label": "D+",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "FB",
    "id": 208414621,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "1A",
        "bandLevel": 1
      },
      {
        "label": "1A+",
        "bandLevel": 1
      },
      {
        "label": "1B",
        "bandLevel": 1
      },
      {
        "label": "1B+",
        "bandLevel": 1
      },
      {
        "label": "1C",
        "bandLevel": 1
      },
      {
        "label": "1C+",
        "bandLevel": 1
      },
      {
        "label": "2A",
        "bandLevel": 1
      },
      {
        "label": "2A+",
        "bandLevel": 1
      },
      {
        "label": "2B",
        "bandLevel": 1
      },
      {
        "label": "2B+",
        "bandLevel": 1
      },
      {
        "label": "2C",
        "bandLevel": 1
      },
      {
        "label": "2C+",
        "bandLevel": 1
      },
      {
        "label": "3A",
        "bandLevel": 1
      },
      {
        "label": "3A+",
        "bandLevel": 1
      },
      {
        "label": "3B",
        "bandLevel": 1
      },
      {
        "label": "3B+",
        "bandLevel": 1
      },
      {
        "label": "3C",
        "bandLevel": 1
      },
      {
        "label": "3C+",
        "bandLevel": 1
      },
      {
        "label": "4A",
        "bandLevel": 2
      },
      {
        "label": "4A+",
        "bandLevel": 2
      },
      {
        "label": "4B",
        "bandLevel": 2
      },
      {
        "label": "4B+",
        "bandLevel": 2
      },
      {
        "label": "4C",
        "bandLevel": 2
      },
      {
        "label": "4C+",
        "bandLevel": 2
      },
      {
        "label": "5A",
        "bandLevel": 3
      },
      {
        "label": "5A+",
        "bandLevel": 3
      },
      {
        "label": "5B",
        "bandLevel": 3
      },
      {
        "label": "5B+",
        "bandLevel": 3
      },
      {
        "label": "5C",
        "bandLevel": 3
      },
      {
        "label": "5C+",
        "bandLevel": 3
      },
      {
        "label": "6A",
        "bandLevel": 3
      },
      {
        "label": "6A+",
        "bandLevel": 3
      },
      {
        "label": "6B",
        "bandLevel": 3
      },
      {
        "label": "6B+",
        "bandLevel": 3
      },
      {
        "label": "6C",
        "bandLevel": 4
      },
      {
        "label": "6C+",
        "bandLevel": 4
      },
      {
        "label": "7A",
        "bandLevel": 4
      },
      {
        "label": "7A+",
        "bandLevel": 4
      },
      {
        "label": "7B",
        "bandLevel": 4
      },
      {
        "label": "7B+",
        "bandLevel": 4
      },
      {
        "label": "7C",
        "bandLevel": 4
      },
      {
        "label": "7C+",
        "bandLevel": 4
      },
      {
        "label": "8A",
        "bandLevel": 5
      },
      {
        "label": "8A+",
        "bandLevel": 5
      },
      {
        "label": "8B",
        "bandLevel": 5
      },
      {
        "label": "8B+",
        "bandLevel": 5
      },
      {
        "label": "8C",
        "bandLevel": 5
      },
      {
        "label": "8C+",
        "bandLevel": 5
      },
      {
        "label": "9A",
        "bandLevel": 5
      },
      {
        "label": "9A+",
        "bandLevel": 5
      },
      {
        "label": "9B",
        "bandLevel": 5
      },
      {
        "label": "9B+",
        "bandLevel": 5
      },
      {
        "label": "9C",
        "bandLevel": 5
      },
      {
        "label": "9C+",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "FB_ALT",
    "id": 208414627,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "1",
        "bandLevel": 1
      },
      {
        "label": "1+",
        "bandLevel": 1
      },
      {
        "label": "2",
        "bandLevel": 1
      },
      {
        "label": "2+",
        "bandLevel": 1
      },
      {
        "label": "3",
        "bandLevel": 1
      },
      {
        "label": "3+",
        "bandLevel": 1
      },
      {
        "label": "4",
        "bandLevel": 2
      },
      {
        "label": "4+",
        "bandLevel": 2
      },
      {
        "label": "5",
        "bandLevel": 3
      },
      {
        "label": "5+",
        "bandLevel": 3
      },
      {
        "label": "6",
        "bandLevel": 3
      },
      {
        "label": "6+",
        "bandLevel": 4
      },
      {
        "label": "7",
        "bandLevel": 4
      },
      {
        "label": "7+",
        "bandLevel": 4
      },
      {
        "label": "8",
        "bandLevel": 5
      },
      {
        "label": "8+",
        "bandLevel": 5
      },
      {
        "label": "9",
        "bandLevel": null
      },
      {
        "label": "9+",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "AICE",
    "id": 7510990,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "AI1-",
        "bandLevel": 1
      },
      {
        "label": "AI1",
        "bandLevel": 1
      },
      {
        "label": "AI1+",
        "bandLevel": 1
      },
      {
        "label": "AI2-",
        "bandLevel": 1
      },
      {
        "label": "AI2",
        "bandLevel": 1
      },
      {
        "label": "AI2+",
        "bandLevel": 1
      },
      {
        "label": "AI3-",
        "bandLevel": 1
      },
      {
        "label": "AI3",
        "bandLevel": 2
      },
      {
        "label": "AI3+",
        "bandLevel": 2
      },
      {
        "label": "AI4-",
        "bandLevel": 2
      },
      {
        "label": "AI4",
        "bandLevel": 2
      },
      {
        "label": "AI4+",
        "bandLevel": 2
      },
      {
        "label": "AI5-",
        "bandLevel": 3
      },
      {
        "label": "AI5",
        "bandLevel": 3
      },
      {
        "label": "AI5+",
        "bandLevel": 3
      },
      {
        "label": "AI6-",
        "bandLevel": 3
      },
      {
        "label": "AI6",
        "bandLevel": 4
      },
      {
        "label": "AI6+",
        "bandLevel": 4
      },
      {
        "label": "AI7-",
        "bandLevel": 4
      },
      {
        "label": "AI7",
        "bandLevel": 4
      },
      {
        "label": "AI7+",
        "bandLevel": 5
      },
      {
        "label": "AI8-",
        "bandLevel": 5
      },
      {
        "label": "AI8",
        "bandLevel": 5
      },
      {
        "label": "AI8+",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "WICE",
    "id": 7510996,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "WI1-",
        "bandLevel": 1
      },
      {
        "label": "WI1",
        "bandLevel": 1
      },
      {
        "label": "WI1+",
        "bandLevel": 1
      },
      {
        "label": "WI2-",
        "bandLevel": 1
      },
      {
        "label": "WI2",
        "bandLevel": 1
      },
      {
        "label": "WI2+",
        "bandLevel": 1
      },
      {
        "label": "WI3-",
        "bandLevel": 1
      },
      {
        "label": "WI3",
        "bandLevel": 2
      },
      {
        "label": "WI3+",
        "bandLevel": 2
      },
      {
        "label": "WI4-",
        "bandLevel": 2
      },
      {
        "label": "WI4",
        "bandLevel": 2
      },
      {
        "label": "WI4+",
        "bandLevel": 2
      },
      {
        "label": "WI5-",
        "bandLevel": 3
      },
      {
        "label": "WI5",
        "bandLevel": 3
      },
      {
        "label": "WI5+",
        "bandLevel": 3
      },
      {
        "label": "WI6-",
        "bandLevel": 3
      },
      {
        "label": "WI6",
        "bandLevel": 4
      },
      {
        "label": "WI6+",
        "bandLevel": 4
      },
      {
        "label": "WI7-",
        "bandLevel": 4
      },
      {
        "label": "WI7",
        "bandLevel": 4
      },
      {
        "label": "WI7+",
        "bandLevel": 5
      },
      {
        "label": "WI8-",
        "bandLevel": 5
      },
      {
        "label": "WI8",
        "bandLevel": 5
      },
      {
        "label": "WI8+",
        "bandLevel": 5
      },
      {
        "label": "WI9-",
        "bandLevel": 5
      },
      {
        "label": "WI9",
        "bandLevel": 5
      },
      {
        "label": "WI9+",
        "bandLevel": 5
      },
      {
        "label": "WI10-",
        "bandLevel": 5
      },
      {
        "label": "WI10",
        "bandLevel": 5
      },
      {
        "label": "WI10+",
        "bandLevel": 5
      },
      {
        "label": "WI11-",
        "bandLevel": 5
      },
      {
        "label": "WI11",
        "bandLevel": 5
      },
      {
        "label": "WI11+",
        "bandLevel": 5
      },
      {
        "label": "WI12-",
        "bandLevel": 5
      },
      {
        "label": "WI12",
        "bandLevel": 5
      },
      {
        "label": "WI12+",
        "bandLevel": 5
      },
      {
        "label": "WI13-",
        "bandLevel": 5
      },
      {
        "label": "WI13",
        "bandLevel": 5
      },
      {
        "label": "WI13+",
        "bandLevel": 5
      },
      {
        "label": "WI14-",
        "bandLevel": 5
      },
      {
        "label": "WI14",
        "bandLevel": 5
      },
      {
        "label": "WI14+",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "MIXED",
    "id": 7511002,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "M1",
        "bandLevel": 1
      },
      {
        "label": "M2",
        "bandLevel": 1
      },
      {
        "label": "M3",
        "bandLevel": 2
      },
      {
        "label": "M4",
        "bandLevel": 2
      },
      {
        "label": "M5",
        "bandLevel": 2
      },
      {
        "label": "M6",
        "bandLevel": 3
      },
      {
        "label": "M7",
        "bandLevel": 3
      },
      {
        "label": "M8",
        "bandLevel": 4
      },
      {
        "label": "M9",
        "bandLevel": 4
      },
      {
        "label": "M10",
        "bandLevel": 5
      },
      {
        "label": "M11",
        "bandLevel": 5
      },
      {
        "label": "M12",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "IFAS",
    "id": 7511008,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "F",
        "bandLevel": null
      },
      {
        "label": "PD",
        "bandLevel": null
      },
      {
        "label": "AD",
        "bandLevel": null
      },
      {
        "label": "D",
        "bandLevel": null
      },
      {
        "label": "TD",
        "bandLevel": null
      },
      {
        "label": "ED",
        "bandLevel": null
      },
      {
        "label": "ABO",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "NCCS",
    "id": 7511014,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "I",
        "bandLevel": null
      },
      {
        "label": "II",
        "bandLevel": null
      },
      {
        "label": "III",
        "bandLevel": null
      },
      {
        "label": "IV",
        "bandLevel": null
      },
      {
        "label": "V",
        "bandLevel": null
      },
      {
        "label": "VI",
        "bandLevel": null
      },
      {
        "label": "VII",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "PROT",
    "id": 7511020,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "G",
        "bandLevel": null
      },
      {
        "label": "PG",
        "bandLevel": null
      },
      {
        "label": "PG13",
        "bandLevel": null
      },
      {
        "label": "R",
        "bandLevel": null
      },
      {
        "label": "S",
        "bandLevel": null
      },
      {
        "label": "VS",
        "bandLevel": null
      },
      {
        "label": "X",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "STAR",
    "id": 7511026,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "*",
        "bandLevel": null
      },
      {
        "label": "**",
        "bandLevel": null
      },
      {
        "label": "***",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "JUMP",
    "id": 208414654,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "1",
        "bandLevel": null
      },
      {
        "label": "2",
        "bandLevel": null
      },
      {
        "label": "3",
        "bandLevel": null
      },
      {
        "label": "4",
        "bandLevel": null
      },
      {
        "label": "5",
        "bandLevel": null
      },
      {
        "label": "6",
        "bandLevel": null
      },
      {
        "label": "7",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "SCHALL",
    "id": 285768865,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "A",
        "bandLevel": 1
      },
      {
        "label": "B",
        "bandLevel": 1
      },
      {
        "label": "C",
        "bandLevel": 1
      },
      {
        "label": "D",
        "bandLevel": 2
      },
      {
        "label": "E",
        "bandLevel": 3
      },
      {
        "label": "F",
        "bandLevel": 4
      }
    ]
  },
  {
    "label": "VF_NUM",
    "id": 285768871,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "1",
        "bandLevel": 1
      },
      {
        "label": "2",
        "bandLevel": 1
      },
      {
        "label": "3",
        "bandLevel": 1
      },
      {
        "label": "4",
        "bandLevel": 2
      },
      {
        "label": "5",
        "bandLevel": 3
      },
      {
        "label": "6",
        "bandLevel": 4
      }
    ]
  },
  {
    "label": "VF_FR",
    "id": 285768877,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "F",
        "bandLevel": 1
      },
      {
        "label": "PD",
        "bandLevel": 1
      },
      {
        "label": "AD",
        "bandLevel": 1
      },
      {
        "label": "D",
        "bandLevel": 2
      },
      {
        "label": "TD",
        "bandLevel": 3
      },
      {
        "label": "ED",
        "bandLevel": 4
      }
    ]
  },
  {
    "label": "DWS_S",
    "id": 343015918,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "S0",
        "bandLevel": null
      },
      {
        "label": "S1",
        "bandLevel": null
      },
      {
        "label": "S2",
        "bandLevel": null
      },
      {
        "label": "S3",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "DST",
    "id": 343015924,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "D1",
        "bandLevel": null
      },
      {
        "label": "D2",
        "bandLevel": null
      },
      {
        "label": "D3",
        "bandLevel": null
      },
      {
        "label": "D4",
        "bandLevel": null
      },
      {
        "label": "D5",
        "bandLevel": null
      },
      {
        "label": "D6",
        "bandLevel": null
      },
      {
        "label": "D7",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "EXP",
    "id": 343015930,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "E1",
        "bandLevel": null
      },
      {
        "label": "E2",
        "bandLevel": null
      },
      {
        "label": "E3",
        "bandLevel": null
      },
      {
        "label": "E4",
        "bandLevel": null
      },
      {
        "label": "E5",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "ANNOT",
    "id": 374687935,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "B1",
        "bandLevel": 2
      },
      {
        "label": "B2",
        "bandLevel": 2
      },
      {
        "label": "B3",
        "bandLevel": 3
      },
      {
        "label": "B4",
        "bandLevel": 3
      },
      {
        "label": "B5",
        "bandLevel": 3
      },
      {
        "label": "B6",
        "bandLevel": 3
      },
      {
        "label": "B7",
        "bandLevel": 4
      },
      {
        "label": "B8",
        "bandLevel": 4
      },
      {
        "label": "B9",
        "bandLevel": 4
      },
      {
        "label": "B10",
        "bandLevel": 4
      },
      {
        "label": "B11",
        "bandLevel": 4
      },
      {
        "label": "B12",
        "bandLevel": 4
      },
      {
        "label": "B13",
        "bandLevel": 4
      },
      {
        "label": "B14",
        "bandLevel": 5
      },
      {
        "label": "B15",
        "bandLevel": 5
      },
      {
        "label": "B16",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "FB_TRAV",
    "id": 374687941,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "1A",
        "bandLevel": 1
      },
      {
        "label": "1A+",
        "bandLevel": 1
      },
      {
        "label": "1B",
        "bandLevel": 1
      },
      {
        "label": "1B+",
        "bandLevel": 1
      },
      {
        "label": "1C",
        "bandLevel": 1
      },
      {
        "label": "1C+",
        "bandLevel": 1
      },
      {
        "label": "2A",
        "bandLevel": 1
      },
      {
        "label": "2A+",
        "bandLevel": 1
      },
      {
        "label": "2B",
        "bandLevel": 1
      },
      {
        "label": "2B+",
        "bandLevel": 1
      },
      {
        "label": "2C",
        "bandLevel": 1
      },
      {
        "label": "2C+",
        "bandLevel": 1
      },
      {
        "label": "3A",
        "bandLevel": 1
      },
      {
        "label": "3A+",
        "bandLevel": 1
      },
      {
        "label": "3B",
        "bandLevel": 1
      },
      {
        "label": "3B+",
        "bandLevel": 1
      },
      {
        "label": "3C",
        "bandLevel": 1
      },
      {
        "label": "3C+",
        "bandLevel": 1
      },
      {
        "label": "4A",
        "bandLevel": 2
      },
      {
        "label": "4A+",
        "bandLevel": 2
      },
      {
        "label": "4B",
        "bandLevel": 2
      },
      {
        "label": "4B+",
        "bandLevel": 2
      },
      {
        "label": "4C",
        "bandLevel": 2
      },
      {
        "label": "4C+",
        "bandLevel": 2
      },
      {
        "label": "5A",
        "bandLevel": 2
      },
      {
        "label": "5A+",
        "bandLevel": 2
      },
      {
        "label": "5B",
        "bandLevel": 2
      },
      {
        "label": "5B+",
        "bandLevel": 2
      },
      {
        "label": "5C",
        "bandLevel": 2
      },
      {
        "label": "5C+",
        "bandLevel": 2
      },
      {
        "label": "6A",
        "bandLevel": 2
      },
      {
        "label": "6A+",
        "bandLevel": 3
      },
      {
        "label": "6B",
        "bandLevel": 3
      },
      {
        "label": "6B+",
        "bandLevel": 3
      },
      {
        "label": "6C",
        "bandLevel": 3
      },
      {
        "label": "6C+",
        "bandLevel": 3
      },
      {
        "label": "7A",
        "bandLevel": 3
      },
      {
        "label": "7A+",
        "bandLevel": 3
      },
      {
        "label": "7B",
        "bandLevel": 4
      },
      {
        "label": "7B+",
        "bandLevel": 4
      },
      {
        "label": "7C",
        "bandLevel": 4
      },
      {
        "label": "7C+",
        "bandLevel": 4
      },
      {
        "label": "8A",
        "bandLevel": 4
      },
      {
        "label": "8A+",
        "bandLevel": 4
      },
      {
        "label": "8B",
        "bandLevel": 4
      },
      {
        "label": "8B+",
        "bandLevel": 4
      },
      {
        "label": "8C",
        "bandLevel": 5
      },
      {
        "label": "8C+",
        "bandLevel": 5
      },
      {
        "label": "9A",
        "bandLevel": 5
      },
      {
        "label": "9A+",
        "bandLevel": 5
      },
      {
        "label": "9B",
        "bandLevel": 5
      },
      {
        "label": "9B+",
        "bandLevel": 5
      },
      {
        "label": "9C",
        "bandLevel": 5
      },
      {
        "label": "9C+",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "FB_TRAV_ALT",
    "id": 374687947,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "1",
        "bandLevel": 1
      },
      {
        "label": "1+",
        "bandLevel": 1
      },
      {
        "label": "2",
        "bandLevel": 1
      },
      {
        "label": "2+",
        "bandLevel": 1
      },
      {
        "label": "3",
        "bandLevel": 1
      },
      {
        "label": "3+",
        "bandLevel": 1
      },
      {
        "label": "4",
        "bandLevel": 2
      },
      {
        "label": "4+",
        "bandLevel": 2
      },
      {
        "label": "5",
        "bandLevel": 2
      },
      {
        "label": "5+",
        "bandLevel": 2
      },
      {
        "label": "6",
        "bandLevel": 2
      },
      {
        "label": "6+",
        "bandLevel": 3
      },
      {
        "label": "7",
        "bandLevel": 3
      },
      {
        "label": "7+",
        "bandLevel": 4
      },
      {
        "label": "8",
        "bandLevel": 4
      },
      {
        "label": "8+",
        "bandLevel": 4
      },
      {
        "label": "9",
        "bandLevel": null
      },
      {
        "label": "9+",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "SWE",
    "id": 375047290,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "1-",
        "bandLevel": 1
      },
      {
        "label": "1",
        "bandLevel": 1
      },
      {
        "label": "1+",
        "bandLevel": 1
      },
      {
        "label": "2-",
        "bandLevel": 1
      },
      {
        "label": "2",
        "bandLevel": 1
      },
      {
        "label": "2+",
        "bandLevel": 1
      },
      {
        "label": "3-",
        "bandLevel": 1
      },
      {
        "label": "3",
        "bandLevel": 1
      },
      {
        "label": "3+",
        "bandLevel": 1
      },
      {
        "label": "4-",
        "bandLevel": 1
      },
      {
        "label": "4",
        "bandLevel": 1
      },
      {
        "label": "4+",
        "bandLevel": 2
      },
      {
        "label": "5-",
        "bandLevel": 2
      },
      {
        "label": "5",
        "bandLevel": 2
      },
      {
        "label": "5+",
        "bandLevel": 2
      },
      {
        "label": "6-",
        "bandLevel": 2
      },
      {
        "label": "6",
        "bandLevel": 3
      },
      {
        "label": "6+",
        "bandLevel": 3
      },
      {
        "label": "7-",
        "bandLevel": 3
      },
      {
        "label": "7",
        "bandLevel": 3
      },
      {
        "label": "7+",
        "bandLevel": 3
      },
      {
        "label": "8-",
        "bandLevel": 4
      },
      {
        "label": "8",
        "bandLevel": 4
      },
      {
        "label": "8+",
        "bandLevel": 4
      },
      {
        "label": "9-",
        "bandLevel": 4
      },
      {
        "label": "9",
        "bandLevel": 4
      },
      {
        "label": "9+",
        "bandLevel": 5
      },
      {
        "label": "10-",
        "bandLevel": 5
      },
      {
        "label": "10",
        "bandLevel": 5
      },
      {
        "label": "10+",
        "bandLevel": 5
      },
      {
        "label": "11-",
        "bandLevel": 5
      },
      {
        "label": "11",
        "bandLevel": 5
      },
      {
        "label": "11+",
        "bandLevel": 5
      },
      {
        "label": "12-",
        "bandLevel": 5
      },
      {
        "label": "12",
        "bandLevel": 5
      },
      {
        "label": "12+",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "SCTW",
    "id": 621218338,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "I",
        "bandLevel": null
      },
      {
        "label": "II",
        "bandLevel": null
      },
      {
        "label": "III",
        "bandLevel": null
      },
      {
        "label": "IV",
        "bandLevel": null
      },
      {
        "label": "V",
        "bandLevel": null
      },
      {
        "label": "VI",
        "bandLevel": null
      },
      {
        "label": "VII",
        "bandLevel": null
      },
      {
        "label": "VIII",
        "bandLevel": null
      },
      {
        "label": "IX",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "SCTWT",
    "id": 621218344,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "1",
        "bandLevel": 1
      },
      {
        "label": "2",
        "bandLevel": 1
      },
      {
        "label": "3",
        "bandLevel": 1
      },
      {
        "label": "4",
        "bandLevel": 1
      },
      {
        "label": "5",
        "bandLevel": 2
      },
      {
        "label": "6",
        "bandLevel": 3
      },
      {
        "label": "7",
        "bandLevel": 3
      },
      {
        "label": "8",
        "bandLevel": 4
      },
      {
        "label": "9",
        "bandLevel": 5
      },
      {
        "label": "10",
        "bandLevel": 5
      },
      {
        "label": "11",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "RUS",
    "id": 622228528,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "1A",
        "bandLevel": 1
      },
      {
        "label": "1B",
        "bandLevel": 1
      },
      {
        "label": "2A",
        "bandLevel": 1
      },
      {
        "label": "2B",
        "bandLevel": 1
      },
      {
        "label": "3A",
        "bandLevel": 1
      },
      {
        "label": "3B",
        "bandLevel": 1
      },
      {
        "label": "4A",
        "bandLevel": 2
      },
      {
        "label": "4B",
        "bandLevel": 2
      },
      {
        "label": "5A",
        "bandLevel": 3
      },
      {
        "label": "5B",
        "bandLevel": 3
      },
      {
        "label": "6A",
        "bandLevel": 4
      },
      {
        "label": "6B",
        "bandLevel": 4
      },
      {
        "label": "7A",
        "bandLevel": 5
      },
      {
        "label": "7B",
        "bandLevel": 5
      }
    ]
  },
  {
    "label": "ALSK",
    "id": 622228534,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "1",
        "bandLevel": null
      },
      {
        "label": "2",
        "bandLevel": null
      },
      {
        "label": "3",
        "bandLevel": null
      },
      {
        "label": "4",
        "bandLevel": null
      },
      {
        "label": "5",
        "bandLevel": null
      },
      {
        "label": "6",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "COM",
    "id": 622228540,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "I",
        "bandLevel": null
      },
      {
        "label": "II",
        "bandLevel": null
      },
      {
        "label": "III",
        "bandLevel": null
      },
      {
        "label": "IV",
        "bandLevel": null
      },
      {
        "label": "V",
        "bandLevel": null
      },
      {
        "label": "VI",
        "bandLevel": null
      },
      {
        "label": "VII",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "RPROT",
    "id": 622228546,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "R1",
        "bandLevel": null
      },
      {
        "label": "R2",
        "bandLevel": null
      },
      {
        "label": "R3",
        "bandLevel": null
      },
      {
        "label": "R4",
        "bandLevel": null
      },
      {
        "label": "R5",
        "bandLevel": null
      },
      {
        "label": "R6",
        "bandLevel": null
      }
    ]
  },
  {
    "label": "SPROT",
    "id": 622228552,
    "grade": [
      {
        "label": "--",
        "bandLevel": null
      },
      {
        "label": "S1",
        "bandLevel": null
      },
      {
        "label": "S2",
        "bandLevel": null
      },
      {
        "label": "S3",
        "bandLevel": null
      },
      {
        "label": "S4",
        "bandLevel": null
      },
      {
        "label": "S5",
        "bandLevel": null
      },
      {
        "label": "S6",
        "bandLevel": null
      }
    ]
  }
]
;
