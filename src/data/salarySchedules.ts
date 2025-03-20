
// Salary schedules from UFT with effective dates
// Each schedule has a valid from date and the salary data for each differential and step

interface SalaryStep {
  [key: string]: number;
}

interface SalaryDifferential {
  BA_C1: SalaryStep;
  C1_PD: SalaryStep;
  BA30_C2: SalaryStep;
  C2_ID: SalaryStep;
  MA_C2_PD: SalaryStep;
  C2_ID_PD: SalaryStep;
  C6: SalaryStep;
  MA30_C6_PD: SalaryStep;
}

interface SalarySchedule {
  effectiveDate: Date;
  description: string;
  differentials: SalaryDifferential;
  longevityAmounts: {
    L5: number;
    L10: number;
    L13: number;
    L15: number;
    L18: number;
    L20: number;
    L22: number;
  };
}

// Helper functions to get the differential name for display
export const getDifferentialName = (differentialCode: string): string => {
  switch (differentialCode) {
    case "BA_C1": return "BA C1";
    case "C1_PD": return "C1 +PD";
    case "BA30_C2": return "BA+30 or C2";
    case "C2_ID": return "C2+ID";
    case "MA_C2_PD": return "MA or C2 + PD";
    case "C2_ID_PD": return "C2 + ID + PD";
    case "C6": return "C6";
    case "MA30_C6_PD": return "MA + 30 or C6 + PD";
    default: return differentialCode;
  }
};

// Format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Define all available salary schedules
export const salarySchedules: SalarySchedule[] = [
  // May 14, 2021 schedule
  {
    effectiveDate: new Date('2021-05-14'),
    description: 'May 14, 2021',
    differentials: {
      BA_C1: {
        "1A": 61070, "1B": 61070, 
        "2A": 62284, "2B": 62284,
        "3A": 62799, "3B": 62799,
        "4A": 63708, "4B": 63708,
        "5A": 64494, "5B": 64494,
        "6A": 65340, "6A+L5": 66626, "6B": 66540, "6B+L5": 67826,
        "7A": 68320, "7A+L5": 69606, "7B": 72490, "7B+L5": 73776,
        "8A": 76390, "8A+L5": 77676, "8B": 81022, "8B+L5": 82308,
        "8B+L10": 86280, "8B+L13": 88984, "8B+L15": 94691, "8B+L18": 96189,
        "8B+L20": 107263, "8B+L22": 113496
      },
      C1_PD: {
        "1A": 66601, "1B": 66601, 
        "2A": 67815, "2B": 67815,
        "3A": 68330, "3B": 68330,
        "4A": 69239, "4B": 69239,
        "5A": 70025, "5B": 70025,
        "6A": 70871, "6A+L5": 72157, "6B": 72071, "6B+L5": 73357,
        "7A": 73851, "7A+L5": 75137, "7B": 78021, "7B+L5": 79307,
        "8A": 81921, "8A+L5": 83207, "8B": 86553, "8B+L5": 87839,
        "8B+L10": 91811, "8B+L13": 94515, "8B+L15": 100222, "8B+L18": 101720,
        "8B+L20": 112794, "8B+L22": 119027
      },
      BA30_C2: {
        "1A": 63120, "1B": 63120, 
        "2A": 64334, "2B": 64334,
        "3A": 64849, "3B": 64849,
        "4A": 65758, "4B": 65758,
        "5A": 66544, "5B": 66544,
        "6A": 67390, "6A+L5": 68676, "6B": 68590, "6B+L5": 69876,
        "7A": 70370, "7A+L5": 71656, "7B": 74540, "7B+L5": 75826,
        "8A": 78440, "8A+L5": 79726, "8B": 83072, "8B+L5": 84358,
        "8B+L10": 88330, "8B+L13": 91034, "8B+L15": 96741, "8B+L18": 98239,
        "8B+L20": 109313, "8B+L22": 115546
      },
      C2_ID: {
        "1A": 66909, "1B": 66909, 
        "2A": 68123, "2B": 68123,
        "3A": 68638, "3B": 68638,
        "4A": 69547, "4B": 69547,
        "5A": 70333, "5B": 70333,
        "6A": 71179, "6A+L5": 72465, "6B": 72379, "6B+L5": 73665,
        "7A": 74159, "7A+L5": 75445, "7B": 78329, "7B+L5": 79615,
        "8A": 82229, "8A+L5": 83515, "8B": 86861, "8B+L5": 88147,
        "8B+L10": 92119, "8B+L13": 94823, "8B+L15": 100530, "8B+L18": 102028,
        "8B+L20": 113102, "8B+L22": 119335
      },
      MA_C2_PD: {
        "1A": 68652, "1B": 68652, 
        "2A": 69866, "2B": 69866,
        "3A": 70381, "3B": 70381,
        "4A": 71290, "4B": 71290,
        "5A": 72076, "5B": 72076,
        "6A": 72922, "6A+L5": 74208, "6B": 74122, "6B+L5": 75408,
        "7A": 75902, "7A+L5": 77188, "7B": 80072, "7B+L5": 81358,
        "8A": 83972, "8A+L5": 85258, "8B": 88604, "8B+L5": 89890,
        "8B+L10": 93862, "8B+L13": 96566, "8B+L15": 102273, "8B+L18": 103771,
        "8B+L20": 114845, "8B+L22": 121078
      },
      C2_ID_PD: {
        "1A": 72437, "1B": 72437, 
        "2A": 73651, "2B": 73651,
        "3A": 74166, "3B": 74166,
        "4A": 75075, "4B": 75075,
        "5A": 75861, "5B": 75861,
        "6A": 76707, "6A+L5": 77993, "6B": 77907, "6B+L5": 79193,
        "7A": 79687, "7A+L5": 80973, "7B": 83857, "7B+L5": 85143,
        "8A": 87757, "8A+L5": 89043, "8B": 92389, "8B+L5": 93675,
        "8B+L10": 97647, "8B+L13": 100351, "8B+L15": 106058, "8B+L18": 107556,
        "8B+L20": 118630, "8B+L22": 124863
      },
      C6: {
        "1A": 70703, "1B": 70703, 
        "2A": 71917, "2B": 71917,
        "3A": 72432, "3B": 72432,
        "4A": 73341, "4B": 73341,
        "5A": 74127, "5B": 74127,
        "6A": 74973, "6A+L5": 76259, "6B": 76173, "6B+L5": 77459,
        "7A": 77953, "7A+L5": 79239, "7B": 82123, "7B+L5": 83409,
        "8A": 86023, "8A+L5": 87309, "8B": 90655, "8B+L5": 91941,
        "8B+L10": 95913, "8B+L13": 98617, "8B+L15": 104324, "8B+L18": 105822,
        "8B+L20": 116896, "8B+L22": 123129
      },
      MA30_C6_PD: {
        "1A": 76231, "1B": 76231, 
        "2A": 77445, "2B": 77445,
        "3A": 77960, "3B": 77960,
        "4A": 78869, "4B": 78869,
        "5A": 79655, "5B": 79655,
        "6A": 80501, "6A+L5": 81787, "6B": 81701, "6B+L5": 82987,
        "7A": 83481, "7A+L5": 84767, "7B": 87651, "7B+L5": 88937,
        "8A": 91551, "8A+L5": 92837, "8B": 96183, "8B+L5": 97469,
        "8B+L10": 101441, "8B+L13": 104145, "8B+L15": 109852, "8B+L18": 111350,
        "8B+L20": 122424, "8B+L22": 128657
      }
    },
    longevityAmounts: {
      L5: 1286,
      L10: 5258,
      L13: 7962,
      L15: 13669,
      L18: 15167,
      L20: 26241,
      L22: 32474
    }
  },
  
  // September 14, 2022 schedule (3% increase)
  {
    effectiveDate: new Date('2022-09-14'),
    description: 'September 14, 2022 (3% increase)',
    differentials: {
      BA_C1: {
        "1A": 62902, "1B": 62902, 
        "2A": 64153, "2B": 64153,
        "3A": 64683, "3B": 64683,
        "4A": 65619, "4B": 65619,
        "5A": 66429, "5B": 66429,
        "6A": 67300, "6A+L5": 68625, "6B": 68536, "6B+L5": 69861,
        "7A": 70370, "7A+L5": 71695, "7B": 74665, "7B+L5": 75990,
        "8A": 78682, "8A+L5": 80007, "8B": 83453, "8B+L5": 84778,
        "8B+L10": 88869, "8B+L13": 91654, "8B+L15": 97532, "8B+L18": 99075,
        "8B+L20": 110481, "8B+L22": 116901
      },
      C1_PD: {
        "1A": 68599, "1B": 68599, 
        "2A": 69850, "2B": 69850,
        "3A": 70380, "3B": 70380,
        "4A": 71316, "4B": 71316,
        "5A": 72126, "5B": 72126,
        "6A": 72997, "6A+L5": 74322, "6B": 74233, "6B+L5": 75558,
        "7A": 76067, "7A+L5": 77392, "7B": 80362, "7B+L5": 81687,
        "8A": 84379, "8A+L5": 85704, "8B": 89150, "8B+L5": 90475,
        "8B+L10": 94566, "8B+L13": 97351, "8B+L15": 103229, "8B+L18": 104772,
        "8B+L20": 116178, "8B+L22": 122598
      },
      BA30_C2: {
        "1A": 65014, "1B": 65014, 
        "2A": 66265, "2B": 66265,
        "3A": 66795, "3B": 66795,
        "4A": 67731, "4B": 67731,
        "5A": 68541, "5B": 68541,
        "6A": 69412, "6A+L5": 70737, "6B": 70648, "6B+L5": 71973,
        "7A": 72482, "7A+L5": 73807, "7B": 76777, "7B+L5": 78102,
        "8A": 80794, "8A+L5": 82119, "8B": 85565, "8B+L5": 86890,
        "8B+L10": 90981, "8B+L13": 93766, "8B+L15": 99644, "8B+L18": 101187,
        "8B+L20": 112593, "8B+L22": 119013
      },
      C2_ID: {
        "1A": 68916, "1B": 68916, 
        "2A": 70167, "2B": 70167,
        "3A": 70697, "3B": 70697,
        "4A": 71633, "4B": 71633,
        "5A": 72443, "5B": 72443,
        "6A": 73314, "6A+L5": 74639, "6B": 74550, "6B+L5": 75875,
        "7A": 76384, "7A+L5": 77709, "7B": 80679, "7B+L5": 82004,
        "8A": 84696, "8A+L5": 86021, "8B": 89467, "8B+L5": 90792,
        "8B+L10": 94883, "8B+L13": 97668, "8B+L15": 103546, "8B+L18": 105089,
        "8B+L20": 116495, "8B+L22": 122915
      },
      MA_C2_PD: {
        "1A": 70711, "1B": 70711, 
        "2A": 71962, "2B": 71962,
        "3A": 72492, "3B": 72492,
        "4A": 73428, "4B": 73428,
        "5A": 74238, "5B": 74238,
        "6A": 75109, "6A+L5": 76434, "6B": 76345, "6B+L5": 77670,
        "7A": 78179, "7A+L5": 79504, "7B": 82474, "7B+L5": 83799,
        "8A": 86491, "8A+L5": 87816, "8B": 91262, "8B+L5": 92587,
        "8B+L10": 96678, "8B+L13": 99463, "8B+L15": 105341, "8B+L18": 106884,
        "8B+L20": 118290, "8B+L22": 124710
      },
      C2_ID_PD: {
        "1A": 74610, "1B": 74610, 
        "2A": 75861, "2B": 75861,
        "3A": 76391, "3B": 76391,
        "4A": 77327, "4B": 77327,
        "5A": 78137, "5B": 78137,
        "6A": 79008, "6A+L5": 80333, "6B": 80244, "6B+L5": 81569,
        "7A": 82078, "7A+L5": 83403, "7B": 86373, "7B+L5": 87698,
        "8A": 90390, "8A+L5": 91715, "8B": 95161, "8B+L5": 96486,
        "8B+L10": 100577, "8B+L13": 103362, "8B+L15": 109240, "8B+L18": 110783,
        "8B+L20": 122189, "8B+L22": 128609
      },
      C6: {
        "1A": 72824, "1B": 72824, 
        "2A": 74075, "2B": 74075,
        "3A": 74605, "3B": 74605,
        "4A": 75541, "4B": 75541,
        "5A": 76351, "5B": 76351,
        "6A": 77222, "6A+L5": 78547, "6B": 78458, "6B+L5": 79783,
        "7A": 80292, "7A+L5": 81617, "7B": 84587, "7B+L5": 85912,
        "8A": 88604, "8A+L5": 89929, "8B": 93375, "8B+L5": 94700,
        "8B+L10": 98791, "8B+L13": 101576, "8B+L15": 107454, "8B+L18": 108997,
        "8B+L20": 120403, "8B+L22": 126823
      },
      MA30_C6_PD: {
        "1A": 78518, "1B": 78518, 
        "2A": 79769, "2B": 79769,
        "3A": 80299, "3B": 80299,
        "4A": 81235, "4B": 81235,
        "5A": 82045, "5B": 82045,
        "6A": 82916, "6A+L5": 84241, "6B": 84152, "6B+L5": 85477,
        "7A": 85986, "7A+L5": 87311, "7B": 90281, "7B+L5": 91606,
        "8A": 94298, "8A+L5": 95623, "8B": 99069, "8B+L5": 100394,
        "8B+L10": 104485, "8B+L13": 107270, "8B+L15": 113148, "8B+L18": 114691,
        "8B+L20": 126097, "8B+L22": 132517
      }
    },
    longevityAmounts: {
      L5: 1325,
      L10: 5416,
      L13: 8201,
      L15: 14079,
      L18: 15622,
      L20: 27028,
      L22: 33448
    }
  },
  
  // January 18, 2024 schedule (3% increase)
  {
    effectiveDate: new Date('2024-01-18'),
    description: 'January 18, 2024 (3% increase)',
    differentials: {
      BA_C1: {
        "1A": 64789, "1B": 64789, 
        "2A": 66078, "2B": 66078,
        "3A": 66623, "3B": 66623,
        "4A": 67588, "4B": 67588,
        "5A": 68422, "5B": 68422,
        "6A": 69319, "6A+L5": 70684, "6B": 70592, "6B+L5": 71957,
        "7A": 72481, "7A+L5": 73846, "7B": 76905, "7B+L5": 78270,
        "8A": 81042, "8A+L5": 82407, "8B": 85957, "8B+L5": 87322,
        "8B+L10": 91535, "8B+L13": 94404, "8B+L15": 100458, "8B+L18": 102048,
        "8B+L20": 113796, "8B+L22": 120408
      },
      C1_PD: {
        "1A": 70657, "1B": 70657, 
        "2A": 71946, "2B": 71946,
        "3A": 72491, "3B": 72491,
        "4A": 73456, "4B": 73456,
        "5A": 74290, "5B": 74290,
        "6A": 75187, "6A+L5": 76552, "6B": 76460, "6B+L5": 77825,
        "7A": 78349, "7A+L5": 79714, "7B": 82773, "7B+L5": 84138,
        "8A": 86910, "8A+L5": 88275, "8B": 91825, "8B+L5": 93190,
        "8B+L10": 97403, "8B+L13": 100272, "8B+L15": 106326, "8B+L18": 107916,
        "8B+L20": 119664, "8B+L22": 126276
      },
      BA30_C2: {
        "1A": 66964, "1B": 66964, 
        "2A": 68253, "2B": 68253,
        "3A": 68798, "3B": 68798,
        "4A": 69763, "4B": 69763,
        "5A": 70597, "5B": 70597,
        "6A": 71494, "6A+L5": 72859, "6B": 72767, "6B+L5": 74132,
        "7A": 74656, "7A+L5": 76021, "7B": 79080, "7B+L5": 80445,
        "8A": 83217, "8A+L5": 84582, "8B": 88132, "8B+L5": 89497,
        "8B+L10": 93710, "8B+L13": 96579, "8B+L15": 102633, "8B+L18": 104223,
        "8B+L20": 115971, "8B+L22": 122583
      },
      C2_ID: {
        "1A": 70983, "1B": 70983, 
        "2A": 72272, "2B": 72272,
        "3A": 72817, "3B": 72817,
        "4A": 73782, "4B": 73782,
        "5A": 74616, "5B": 74616,
        "6A": 75513, "6A+L5": 76878, "6B": 76786, "6B+L5": 78151,
        "7A": 78675, "7A+L5": 80040, "7B": 83099, "7B+L5": 84464,
        "8A": 87236, "8A+L5": 88601, "8B": 92151, "8B+L5": 93516,
        "8B+L10": 97729, "8B+L13": 100598, "8B+L15": 106652, "8B+L18": 108242,
        "8B+L20": 119990, "8B+L22": 126602
      },
      MA_C2_PD: {
        "1A": 72832, "1B": 72832, 
        "2A": 74121, "2B": 74121,
        "3A": 74666, "3B": 74666,
        "4A": 75631, "4B": 75631,
        "5A": 76465, "5B": 76465,
        "6A": 77362, "6A+L5": 78727, "6B": 78635, "6B+L5": 80000,
        "7A": 80524, "7A+L5": 81889, "7B": 84948, "7B+L5": 86313,
        "8A": 89085, "8A+L5": 90450, "8B": 94000, "8B+L5": 95365,
        "8B+L10": 99578, "8B+L13": 102447, "8B+L15": 108501, "8B+L18": 110091,
        "8B+L20": 121839, "8B+L22": 128451
      },
      C2_ID_PD: {
        "1A": 76848, "1B": 76848, 
        "2A": 78137, "2B": 78137,
        "3A": 78682, "3B": 78682,
        "4A": 79647, "4B": 79647,
        "5A": 80481, "5B": 80481,
        "6A": 81378, "6A+L5": 82743, "6B": 82651, "6B+L5": 84016,
        "7A": 84540, "7A+L5": 85905, "7B": 88964, "7B+L5": 90329,
        "8A": 93101, "8A+L5": 94466, "8B": 98016, "8B+L5": 99381,
        "8B+L10": 103594, "8B+L13": 106463, "8B+L15": 112517, "8B+L18": 114107,
        "8B+L20": 125855, "8B+L22": 132467
      },
      C6: {
        "1A": 75009, "1B": 75009, 
        "2A": 76298, "2B": 76298,
        "3A": 76843, "3B": 76843,
        "4A": 77808, "4B": 77808,
        "5A": 78642, "5B": 78642,
        "6A": 79539, "6A+L5": 80904, "6B": 80812, "6B+L5": 82177,
        "7A": 82701, "7A+L5": 84066, "7B": 87125, "7B+L5": 88490,
        "8A": 91262, "8A+L5": 92627, "8B": 96177, "8B+L5": 97542,
        "8B+L10": 101755, "8B+L13": 104624, "8B+L15": 110678, "8B+L18": 112268,
        "8B+L20": 124016, "8B+L22": 130628
      },
      MA30_C6_PD: {
        "1A": 80873, "1B": 80873, 
        "2A": 82162, "2B": 82162,
        "3A": 82707, "3B": 82707,
        "4A": 83672, "4B": 83672,
        "5A": 84506, "5B": 84506,
        "6A": 85403, "6A+L5": 86768, "6B": 86676, "6B+L5": 88041,
        "7A": 88565, "7A+L5": 89930, "7B": 92989, "7B+L5": 94354,
        "8A": 97126, "8A+L5": 98491, "8B": 102041, "8B+L5": 103406,
        "8B+L10": 107619, "8B+L13": 110488, "8B+L15": 116542, "8B+L18": 118132,
        "8B+L20": 129880, "8B+L22": 136492
      }
    },
    longevityAmounts: {
      L5: 1365,
      L10: 5578,
      L13: 8447,
      L15: 14501,
      L18: 16091,
      L20: 27839,
      L22: 34451
    }
  },
  
  // January 18, 2025 schedule (3% increase)
  {
    effectiveDate: new Date('2025-01-18'),
    description: 'January 18, 2025 (3% increase)',
    differentials: {
      BA_C1: {
        "1A": 66733, "1B": 66733, 
        "2A": 68060, "2B": 68060,
        "3A": 68622, "3B": 68622,
        "4A": 69616, "4B": 69616,
        "5A": 70475, "5B": 70475,
        "6A": 71399, "6A+L5": 72805, "6B": 72710, "6B+L5": 74116,
        "7A": 74655, "7A+L5": 76061, "7B": 79212, "7B+L5": 80618,
        "8A": 83473, "8A+L5": 84879, "8B": 88536, "8B+L5": 89942,
        "8B+L10": 94281, "8B+L13": 97236, "8B+L15": 103472, "8B+L18": 105110,
        "8B+L20": 117210, "8B+L22": 124021
      },
      C1_PD: {
        "1A": 72777, "1B": 72777, 
        "2A": 74104, "2B": 74104,
        "3A": 74666, "3B": 74666,
        "4A": 75660, "4B": 75660,
        "5A": 76519, "5B": 76519,
        "6A": 77443, "6A+L5": 78849, "6B": 78754, "6B+L5": 80160,
        "7A": 80699, "7A+L5": 82105, "7B": 85256, "7B+L5": 86662,
        "8A": 89517, "8A+L5": 90923, "8B": 94580, "8B+L5": 95986,
        "8B+L10": 100325, "8B+L13": 103280, "8B+L15": 109516, "8B+L18": 111154,
        "8B+L20": 123254, "8B+L22": 130065
      },
      BA30_C2: {
        "1A": 68973, "1B": 68973, 
        "2A": 70300, "2B": 70300,
        "3A": 70862, "3B": 70862,
        "4A": 71856, "4B": 71856,
        "5A": 72715, "5B": 72715,
        "6A": 73639, "6A+L5": 75045, "6B": 74950, "6B+L5": 76356,
        "7A": 76895, "7A+L5": 78301, "7B": 81452, "7B+L5": 82858,
        "8A": 85713, "8A+L5": 87119, "8B": 90776, "8B+L5": 92182,
        "8B+L10": 96521, "8B+L13": 99476, "8B+L15": 105712, "8B+L18": 107350,
        "8B+L20": 119450, "8B+L22": 126261
      },
      C2_ID: {
        "1A": 73113, "1B": 73113, 
        "2A": 74440, "2B": 74440,
        "3A": 75002, "3B": 75002,
        "4A": 75996, "4B": 75996,
        "5A": 76855, "5B": 76855,
        "6A": 77779, "6A+L5": 79185, "6B": 79090, "6B+L5": 80496,
        "7A": 81035, "7A+L5": 82441, "7B": 85592, "7B+L5": 86998,
        "8A": 89853, "8A+L5": 91259, "8B": 94916, "8B+L5": 96322,
        "8B+L10": 100661, "8B+L13": 103616, "8B+L15": 109852, "8B+L18": 111490,
        "8B+L20": 123590, "8B+L22": 130401
      },
      MA_C2_PD: {
        "1A": 75017, "1B": 75017, 
        "2A": 76344, "2B": 76344,
        "3A": 76906, "3B": 76906,
        "4A": 77900, "4B": 77900,
        "5A": 78759, "5B": 78759,
        "6A": 79683, "6A+L5": 81089, "6B": 80994, "6B+L5": 82400,
        "7A": 82939, "7A+L5": 84345, "7B": 87496, "7B+L5": 88902,
        "8A": 91757, "8A+L5": 93163, "8B": 96820, "8B+L5": 98226,
        "8B+L10": 102565, "8B+L13": 105520, "8B+L15": 111756, "8B+L18": 113394,
        "8B+L20": 125494, "8B+L22": 132305
      },
      C2_ID_PD: {
        "1A": 79154, "1B": 79154, 
        "2A": 80481, "2B": 80481,
        "3A": 81043, "3B": 81043,
        "4A": 82037, "4B": 82037,
        "5A": 82896, "5B": 82896,
        "6A": 83820, "6A+L5": 85226, "6B": 85131, "6B+L5": 86537,
        "7A": 87076, "7A+L5": 88482, "7B": 91633, "7B+L5": 93039,
        "8A": 95894, "8A+L5": 97300, "8B": 100957, "8B+L5": 102363,
        "8B+L10": 106702, "8B+L13": 109657, "8B+L15": 115893, "8B+L18": 117531,
        "8B+L20": 129631, "8B+L22": 136442
      },
      C6: {
        "1A": 77260, "1B": 77260, 
        "2A": 78587, "2B": 78587,
        "3A": 79149, "3B": 79149,
        "4A": 80143, "4B": 80143,
        "5A": 81002, "5B": 81002,
        "6A": 81926, "6A+L5": 83332, "6B": 83237, "6B+L5": 84643,
        "7A": 85182, "7A+L5": 86588, "7B": 89739, "7B+L5": 91145,
        "8A": 94000, "8A+L5": 95406, "8B": 99063, "8B+L5": 100469,
        "8B+L10": 104808, "8B+L13": 107763, "8B+L15": 113999, "8B+L18": 115637,
        "8B+L20": 127737, "8B+L22": 134548
      },
      MA30_C6_PD: {
        "1A": 83300, "1B": 83300, 
        "2A": 84627, "2B": 84627,
        "3A": 85189, "3B": 85189,
        "4A": 86183, "4B": 86183,
        "5A": 87042, "5B": 87042,
        "6A": 87966, "6A+L5": 89372, "6B": 89277, "6B+L5": 90683,
        "7A": 91222, "7A+L5": 92628, "7B": 95779, "7B+L5": 97185,
        "8A": 100040, "8A+L5": 101446, "8B": 105103, "8B+L5": 106509,
        "8B+L10": 110848, "8B+L13": 113803, "8B+L15": 120039, "8B+L18": 121677,
        "8B+L20": 133777, "8B+L22": 140588
      }
    },
    longevityAmounts: {
      L5: 1406,
      L10: 5745,
      L13: 8700,
      L15: 14936,
      L18: 16574,
      L20: 28674,
      L22: 35485
    }
  },
  
  // September 14, 2025 schedule (3.25% increase)
  {
    effectiveDate: new Date('2025-09-14'),
    description: 'September 14, 2025 (3.25% increase)',
    differentials: {
      BA_C1: {
        "1A": 68902, "1B": 68902, 
        "2A": 70272, "2B": 70272,
        "3A": 70852, "3B": 70852,
        "4A": 71879, "4B": 71879,
        "5A": 72765, "5B": 72765,
        "6A": 73719, "6A+L5": 75171, "6B": 75073, "6B+L5": 76525,
        "7A": 77081, "7A+L5": 78533, "7B": 81786, "7B+L5": 83238,
        "8A": 86186, "8A+L5": 87638, "8B": 91413, "8B+L5": 92865,
        "8B+L10": 97345, "8B+L13": 100396, "8B+L15": 106834, "8B+L18": 108526,
        "8B+L20": 121019, "8B+L22": 128051
      },
      C1_PD: {
        "1A": 75142, "1B": 75142, 
        "2A": 76512, "2B": 76512,
        "3A": 77092, "3B": 77092,
        "4A": 78119, "4B": 78119,
        "5A": 79005, "5B": 79005,
        "6A": 79959, "6A+L5": 81411, "6B": 81313, "6B+L5": 82765,
        "7A": 83321, "7A+L5": 84773, "7B": 88026, "7B+L5": 89478,
        "8A": 92426, "8A+L5": 93878, "8B": 97653, "8B+L5": 99105,
        "8B+L10": 103585, "8B+L13": 106636, "8B+L15": 113074, "8B+L18": 114766,
        "8B+L20": 127259, "8B+L22": 134291
      },
      BA30_C2: {
        "1A": 71215, "1B": 71215, 
        "2A": 72585, "2B": 72585,
        "3A": 73165, "3B": 73165,
        "4A": 74192, "4B": 74192,
        "5A": 75078, "5B": 75078,
        "6A": 76032, "6A+L5": 77484, "6B": 77386, "6B+L5": 78838,
        "7A": 79394, "7A+L5": 80846, "7B": 84099, "7B+L5": 85551,
        "8A": 88499, "8A+L5": 89951, "8B": 93726, "8B+L5": 95178,
        "8B+L10": 99658, "8B+L13": 102709, "8B+L15": 109147, "8B+L18": 110839,
        "8B+L20": 123332, "8B+L22": 130364
      },
      C2_ID: {
        "1A": 75489, "1B": 75489, 
        "2A": 76859, "2B": 76859,
        "3A": 77439, "3B": 77439,
        "4A": 78466, "4B": 78466,
        "5A": 79352, "5B": 79352,
        "6A": 80306, "6A+L5": 81758, "6B": 81660, "6B+L5": 83112,
        "7A": 83668, "7A+L5": 85120, "7B": 88373, "7B+L5": 89825,
        "8A": 92773, "8A+L5": 94225, "8B": 98000, "8B+L5": 99452,
        "8B+L10": 103932, "8B+L13": 106983, "8B+L15": 113421, "8B+L18": 115113,
        "8B+L20": 127606, "8B+L22": 134638
      },
      MA_C2_PD: {
        "1A": 77455, "1B": 77455, 
        "2A": 78825, "2B": 78825,
        "3A": 79405, "3B": 79405,
        "4A": 80432, "4B": 80432,
        "5A": 81318, "5B": 81318,
        "6A": 82272, "6A+L5": 83724, "6B": 83626, "6B+L5": 85078,
        "7A": 85634, "7A+L5": 87086, "7B": 90339, "7B+L5": 91791,
        "8A": 94739, "8A+L5": 96191, "8B": 99966, "8B+L5": 101418,
        "8B+L10": 105898, "8B+L13": 108949, "8B+L15": 115387, "8B+L18": 117079,
        "8B+L20": 129572, "8B+L22": 136604
      },
      C2_ID_PD: {
        "1A": 81727, "1B": 81727, 
        "2A": 83097, "2B": 83097,
        "3A": 83677, "3B": 83677,
        "4A": 84704, "4B": 84704,
        "5A": 85590, "5B": 85590,
        "6A": 86544, "6A+L5": 87996, "6B": 87898, "6B+L5": 89350,
        "7A": 89906, "7A+L5": 91358, "7B": 94611, "7B+L5": 96063,
        "8A": 99011, "8A+L5": 100463, "8B": 104238, "8B+L5": 105690,
        "8B+L10": 110170, "8B+L13": 113221, "8B+L15": 119659, "8B+L18": 121351,
        "8B+L20": 133844, "8B+L22": 140876
      },
      C6: {
        "1A": 79771, "1B": 79771, 
        "2A": 81141, "2B": 81141,
        "3A": 81721, "3B": 81721,
        "4A": 82748, "4B": 82748,
        "5A": 83634, "5B": 83634,
        "6A": 84588, "6A+L5": 86040, "6B": 85942, "6B+L5": 87394,
        "7A": 87950, "7A+L5": 89402, "7B": 92655, "7B+L5": 94107,
        "8A": 97055, "8A+L5": 98507, "8B": 102282, "8B+L5": 103734,
        "8B+L10": 108214, "8B+L13": 111265, "8B+L15": 117703, "8B+L18": 119395,
        "8B+L20": 131888, "8B+L22": 138920
      },
      MA30_C6_PD: {
        "1A": 86007, "1B": 86007, 
        "2A": 87377, "2B": 87377,
        "3A": 87957, "3B": 87957,
        "4A": 88984, "4B": 88984,
        "5A": 89870, "5B": 89870,
        "6A": 90824, "6A+L5": 92276, "6B": 92178, "6B+L5": 93630,
        "7A": 94186, "7A+L5": 95638, "7B": 98891, "7B+L5": 100343,
        "8A": 103291, "8A+L5": 104743, "8B": 108518, "8B+L5": 109970,
        "8B+L10": 114450, "8B+L13": 117501, "8B+L15": 123939, "8B+L18": 125631,
        "8B+L20": 138124, "8B+L22": 145156
      }
    },
    longevityAmounts: {
      L5: 1452,
      L10: 5932,
      L13: 8983,
      L15: 15421,
      L18: 17113,
      L20: 29606,
      L22: 36638
    }
  },
  
  // September 14, 2026 schedule (3.5% increase)
  {
    effectiveDate: new Date('2026-09-14'),
    description: 'September 14, 2026 (3.5% increase)',
    differentials: {
      BA_C1: {
        "1A": 71314, "1B": 71314, 
        "2A": 72732, "2B": 72732,
        "3A": 73332, "3B": 73332,
        "4A": 74395, "4B": 74395,
        "5A": 75312, "5B": 75312,
        "6A": 76299, "6A+L5": 77802, "6B": 77701, "6B+L5": 79204,
        "7A": 79779, "7A+L5": 81282, "7B": 84649, "7B+L5": 86152,
        "8A": 89203, "8A+L5": 90706, "8B": 94612, "8B+L5": 96115,
        "8B+L10": 100752, "8B+L13": 103909, "8B+L15": 110573, "8B+L18": 112324,
        "8B+L20": 125254, "8B+L22": 132532
      },
      C1_PD: {
        "1A": 77772, "1B": 77772, 
        "2A": 79190, "2B": 79190,
        "3A": 79790, "3B": 79790,
        "4A": 80853, "4B": 80853,
        "5A": 81770, "5B": 81770,
        "6A": 82757, "6A+L5": 84260, "6B": 84159, "6B+L5": 85662,
        "7A": 86237, "7A+L5": 87740, "7B": 91107, "7B+L5": 92610,
        "8A": 95661, "8A+L5": 97164, "8B": 101070, "8B+L5": 102573,
        "8B+L10": 107210, "8B+L13": 110367, "8B+L15": 117031, "8B+L18": 118782,
        "8B+L20": 131712, "8B+L22": 138990
      },
      BA30_C2: {
        "1A": 73708, "1B": 73708, 
        "2A": 75126, "2B": 75126,
        "3A": 75726, "3B": 75726,
        "4A": 76789, "4B": 76789,
        "5A": 77706, "5B": 77706,
        "6A": 78693, "6A+L5": 80196, "6B": 80095, "6B+L5": 81598,
        "7A": 82173, "7A+L5": 83676, "7B": 87043, "7B+L5": 88546,
        "8A": 91597, "8A+L5": 93100, "8B": 97006, "8B+L5": 98509,
        "8B+L10": 103146, "8B+L13": 106303, "8B+L15": 112967, "8B+L18": 114718,
        "8B+L20": 127648, "8B+L22": 134926
      },
      C2_ID: {
        "1A": 78132, "1B": 78132, 
        "2A": 79550, "2B": 79550,
        "3A": 80150, "3B": 80150,
        "4A": 81213, "4B": 81213,
        "5A": 82130, "5B": 82130,
        "6A": 83117, "6A+L5": 84620, "6B": 84519, "6B+L5": 86022,
        "7A": 86597, "7A+L5": 88100, "7B": 91467, "7B+L5": 92970,
        "8A": 96021, "8A+L5": 97524, "8B": 101430, "8B+L5": 102933,
        "8B+L10": 107570, "8B+L13": 110727, "8B+L15": 117391, "8B+L18": 119142,
        "8B+L20": 132072, "8B+L22": 139350
      },
      MA_C2_PD: {
        "1A": 80166, "1B": 80166, 
        "2A": 81584, "2B": 81584,
        "3A": 82184, "3B": 82184,
        "4A": 83247, "4B": 83247,
        "5A": 84164, "5B": 84164,
        "6A": 85151, "6A+L5": 86654, "6B": 86553, "6B+L5": 88056,
        "7A": 88631, "7A+L5": 90134, "7B": 93501, "7B+L5": 95004,
        "8A": 98055, "8A+L5": 99558, "8B": 103464, "8B+L5": 104967,
        "8B+L10": 109604, "8B+L13": 112761, "8B+L15": 119425, "8B+L18": 121176,
        "8B+L20": 134106, "8B+L22": 141384
      },
      C2_ID_PD: {
        "1A": 84588, "1B": 84588, 
        "2A": 86006, "2B": 86006,
        "3A": 86606, "3B": 86606,
        "4A": 87669, "4B": 87669,
        "5A": 88586, "5B": 88586,
        "6A": 89573, "6A+L5": 91076, "6B": 90975, "6B+L5": 92478,
        "7A": 93053, "7A+L5": 94556, "7B": 97923, "7B+L5": 99426,
        "8A": 102477, "8A+L5": 103980, "8B": 107886, "8B+L5": 109389,
        "8B+L10": 114026, "8B+L13": 117183, "8B+L15": 123847, "8B+L18": 125598,
        "8B+L20": 138528, "8B+L22": 145806
      },
      C6: {
        "1A": 82563, "1B": 82563, 
        "2A": 83981, "2B": 83981,
        "3A": 84581, "3B": 84581,
        "4A": 85644, "4B": 85644,
        "5A": 86561, "5B": 86561,
        "6A": 87548, "6A+L5": 89051, "6B": 88950, "6B+L5": 90453,
        "7A": 91028, "7A+L5": 92531, "7B": 95898, "7B+L5": 97401,
        "8A": 100452, "8A+L5": 101955, "8B": 105861, "8B+L5": 107364,
        "8B+L10": 112001, "8B+L13": 115158, "8B+L15": 121822, "8B+L18": 123573,
        "8B+L20": 136503, "8B+L22": 143781
      },
      MA30_C6_PD: {
        "1A": 89018, "1B": 89018, 
        "2A": 90436, "2B": 90436,
        "3A": 91036, "3B": 91036,
        "4A": 92099, "4B": 92099,
        "5A": 93016, "5B": 93016,
        "6A": 94003, "6A+L5": 95506, "6B": 95405, "6B+L5": 96908,
        "7A": 97483, "7A+L5": 98986, "7B": 102353, "7B+L5": 103856,
        "8A": 106907, "8A+L5": 108410, "8B": 112316, "8B+L5": 113819,
        "8B+L10": 118456, "8B+L13": 121613, "8B+L15": 128277, "8B+L18": 130028,
        "8B+L20": 142958, "8B+L22": 150236
      }
    },
    longevityAmounts: {
      L5: 1503,
      L10: 6140,
      L13: 9297,
      L15: 15961,
      L18: 17712,
      L20: 30642,
      L22: 37920
    }
  },
];

// Get the appropriate salary schedule based on the current date
export const getCurrentSalarySchedule = (): SalarySchedule => {
  const currentDate = new Date();
  
  // Sort schedules by effective date (newest first)
  const sortedSchedules = [...salarySchedules].sort((a, b) => 
    b.effectiveDate.getTime() - a.effectiveDate.getTime()
  );
  
  // Find the most recent schedule that is effective today or earlier
  const currentSchedule = sortedSchedules.find(schedule => 
    schedule.effectiveDate <= currentDate
  );
  
  // Return the current schedule or the oldest if none are effective yet
  return currentSchedule || sortedSchedules[sortedSchedules.length - 1];
};

// Get the next salary schedule that will be effective after the current one
export const getNextSalarySchedule = (): SalarySchedule | null => {
  const currentDate = new Date();
  
  // Sort schedules by effective date (oldest first)
  const sortedSchedules = [...salarySchedules].sort((a, b) => 
    a.effectiveDate.getTime() - b.effectiveDate.getTime()
  );
  
  // Find the next schedule that will be effective after today
  return sortedSchedules.find(schedule => schedule.effectiveDate > currentDate) || null;
};

// Calculate salary with longevity based on years at DOE
export const calculateSalaryWithLongevity = (
  salaryStep: string, 
  differential: string, 
  yearsAtDOE: number
): number => {
  const schedule = getCurrentSalarySchedule();
  
  // Determine if longevity step should be applied
  let stepWithLongevity = salaryStep;
  
  if (yearsAtDOE >= 5 && yearsAtDOE < 10) {
    // Add L5 to steps that support it (6A, 6B, 7A, 7B, 8A, 8B)
    if (['6A', '6B', '7A', '7B', '8A', '8B'].includes(salaryStep)) {
      stepWithLongevity = `${salaryStep}+L5`;
    }
  } else if (yearsAtDOE >= 10 && yearsAtDOE < 13) {
    // Only 8B supports L10
    if (salaryStep === '8B') {
      stepWithLongevity = `8B+L10`;
    } else if (['6A', '6B', '7A', '7B', '8A'].includes(salaryStep)) {
      stepWithLongevity = `${salaryStep}+L5`;
    }
  } else if (yearsAtDOE >= 13 && yearsAtDOE < 15) {
    // Only 8B supports L13
    if (salaryStep === '8B') {
      stepWithLongevity = `8B+L13`;
    } else if (['6A', '6B', '7A', '7B', '8A'].includes(salaryStep)) {
      stepWithLongevity = `${salaryStep}+L5`;
    }
  } else if (yearsAtDOE >= 15 && yearsAtDOE < 18) {
    // Only 8B supports L15
    if (salaryStep === '8B') {
      stepWithLongevity = `8B+L15`;
    } else if (['6A', '6B', '7A', '7B', '8A'].includes(salaryStep)) {
      stepWithLongevity = `${salaryStep}+L5`;
    }
  } else if (yearsAtDOE >= 18 && yearsAtDOE < 20) {
    // Only 8B supports L18
    if (salaryStep === '8B') {
      stepWithLongevity = `8B+L18`;
    } else if (['6A', '6B', '7A', '7B', '8A'].includes(salaryStep)) {
      stepWithLongevity = `${salaryStep}+L5`;
    }
  } else if (yearsAtDOE >= 20 && yearsAtDOE < 22) {
    // Only 8B supports L20
    if (salaryStep === '8B') {
      stepWithLongevity = `8B+L20`;
    } else if (['6A', '6B', '7A', '7B', '8A'].includes(salaryStep)) {
      stepWithLongevity = `${salaryStep}+L5`;
    }
  } else if (yearsAtDOE >= 22) {
    // Only 8B supports L22
    if (salaryStep === '8B') {
      stepWithLongevity = `8B+L22`;
    } else if (['6A', '6B', '7A', '7B', '8A'].includes(salaryStep)) {
      stepWithLongevity = `${salaryStep}+L5`;
    }
  }
  
  // Get the salary from the schedule
  try {
    if (schedule.differentials[differential][stepWithLongevity]) {
      return schedule.differentials[differential][stepWithLongevity];
    } else {
      // If the specific step with longevity doesn't exist, return the base step
      return schedule.differentials[differential][salaryStep] || 0;
    }
  } catch (error) {
    console.error("Error calculating salary:", error);
    return 0;
  }
};
