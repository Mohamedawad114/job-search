import { Sys_Role } from '../Enum';


export interface IToken {
  id: number;
  username: string;
  role: Sys_Role |string;
}

export interface IDecodedToken extends IToken {
    jti: string;
}