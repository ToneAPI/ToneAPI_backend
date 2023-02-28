import { Generated } from "kysely";

export interface KillTable {
  id: Generated<number>;
  server: string;
  attacker: number;
  victim: number;
  weapon: string;
  map: string;
  distance: number;
  date: Date;
}

interface EntityTable {
  id: number;
  name: string;
}
interface WeaponTable {
  id: string;
  name: string;
  description: string;
  image: string;
}
interface MapTable {
  id: string;
  name: string;
  description: string;
  image: string;
}
interface ServerTable {
  id: string;
  name: string;
  description: string;
}
interface Database {
  kill: KillTable;
  entity: EntityTable;
  weapon: WeaponTable;
  maps: MapTable;
  server: ServerTable;
}

export default Database;
