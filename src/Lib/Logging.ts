class Logging {
  datas: Array<string>;
  constructor() {
    this.datas = new Array();
  }
  log(value: string, source: string) {
    this.datas.push(new Date().toJSON() + "\t" + source + "\t" + value);
    console.log(this.datas);
  }
}

export const Log = new Logging();
