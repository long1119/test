import {Injectable} from '@angular/core';
import {BaThemeConfigProvider, colorHelper} from '../../../theme';

@Injectable()
export class PieChartService {

  constructor(private _baConfig:BaThemeConfigProvider) {
  }

  getData() {
    let pieColor = this._baConfig.get().colors.custom.dashboardPieChart;
    return [
      {
        "color": "#00abff",
        "description": "草稿",
        "stats": 60,
        "total": 120
      },
      {
        "color": "#00abff",
        "description": "审批中",
        "stats": 130,
        "total": 260
      },
      {
        "color": "#00abff",
        "description": "已批准",
        "stats": 58,
        "total": 120
      },
      {
        "color": "#00abff",
        "description": "未批准",
        "stats": 117,
        "total": 200
      },
      {
        "color": "#00abff",
        "description": "执行",
        "stats": 196,
        "total": 200
      },
      {
        "color": "#00abff",
        "description": "完成",
        "stats": 32,
        "total": 200
      },
      {
        "color": "#00abff",
        "description": "取消",
        "stats": 32,
        "total": 200
      },
      {
        "color": "#00abff",
        "description": "暂停",
        "stats": 32,
        "total": 200
      }
    ];
  }
}
