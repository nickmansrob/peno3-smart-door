import { DateTime } from 'luxon'
import { start } from './Provider.js'
import { userRestrictions } from './Restriction.js'
import { User } from './types.js'

//await start()


const testuser:User = {
  id: '822d181f-5176-11ed-84c7-00155d7cf41b',
  firstName: 'Rob',
  lastName: 'Nickmans',
  faceDescriptor: [
    -0.09451291710138321,
    0.1486954391002655,
    0.01761234924197197,
    -0.04787283390760422,
    -0.152848482131958,
    0.03753262013196945,
    -0.07387199997901917,
    0.0037964442744851112,
    0.12994901835918427,
    -0.009398487396538258,
    0.21729739010334015,
    0.022376444190740585,
    -0.26544827222824097,
    -0.07278667390346527,
    -0.1049252599477768,
    0.11997739970684052,
    -0.07784244418144226,
    -0.05374855920672417,
    -0.11136717349290848,
    -0.04448394104838371,
    0.054597143083810806,
    0.0917162373661995,
    0.016395768150687218,
    0.08925651758909225,
    -0.08732057362794876,
    -0.33698493242263794,
    -0.06496433168649673,
    -0.13298223912715912,
    0.011087349615991116,
    -0.15036743879318237,
    -0.02727368474006653,
    0.07475540041923523,
    -0.09414394944906235,
    -0.11797870695590973,
    0.045892637223005295,
    0.08253705501556396,
    -0.08952593058347702,
    -0.03848794847726822,
    0.23149055242538452,
    0.10230240970849991,
    -0.0968874841928482,
    0.07267977297306061,
    0.016099657863378525,
    0.36265456676483154,
    0.1540733426809311,
    0.04701162874698639,
    0.06629239767789841,
    -0.0980822890996933,
    0.20569685101509094,
    -0.24803029000759125,
    0.08098535239696503,
    0.17828653752803802,
    0.17903494834899902,
    0.15248103439807892,
    0.09212267398834229,
    -0.20749512314796448,
    0.10806874185800552,
    0.21365034580230713,
    -0.27605006098747253,
    0.11940095573663712,
    -0.020908042788505554,
    -0.0964159220457077,
    -0.03883502632379532,
    -0.039249908179044724,
    0.23524831235408783,
    0.13087256252765656,
    -0.11254151910543442,
    -0.15231356024742126,
    0.18766328692436218,
    -0.09047004580497742,
    -0.03933994472026825,
    0.12713560461997986,
    -0.12134083360433578,
    -0.16182810068130493,
    -0.2106744945049286,
    0.11142374575138092,
    0.33926093578338623,
    0.2348804771900177,
    -0.2680091857910156,
    -0.04645686224102974,
    -0.1257457137107849,
    -0.022214386612176895,
    -0.00504829129204154,
    0.04072166979312897,
    -0.12940284609794617,
    -0.06727968156337738,
    -0.11882463097572327,
    -0.056674063205718994,
    0.10485707968473434,
    0.027388520538806915,
    -0.021434159949421883,
    0.30354276299476624,
    0.12228990346193314,
    0.054334357380867004,
    0.10769019275903702,
    0.04921288788318634,
    -0.22601395845413208,
    -0.043115947395563126,
    -0.11329148709774017,
    -0.08662325888872147,
    0.05041714012622833,
    -0.19006627798080444,
    0.022451147437095642,
    0.05583342909812927,
    -0.19743068516254425,
    0.23241227865219116,
    -0.05494984984397888,
    0.030116092413663864,
    -0.03278718143701553,
    -0.02732883393764496,
    -0.0688079446554184,
    0.02919035777449608,
    0.21701671183109283,
    -0.2682160437107086,
    0.24371060729026794,
    0.12059050798416138,
    0.0738181471824646,
    0.18676263093948364,
    0.13083337247371674,
    0.08268352597951889,
    -0.06710737198591232,
    -0.10387003421783447,
    -0.11524312198162079,
    -0.09491260349750519,
    0.0831587016582489,
    -0.04062315821647644,
    0.026584908366203308,
    0.027503063902258873
  ],
  tfaToken: 'XW7MRHP5BC7FYYI4ERBMYXV5CCW3K2UE',
  roles: [
    'ADMIN'
  ],
  dateCreated: DateTime.fromISO('2022-10-21T21:27:26+02:00')
}

console.log(userRestrictions(testuser))
