export interface User {
  uid?: string;
  email?: string;
  photoURL?: string;
  name?: string;
  friends?: User[];
}

export interface Friend {
  uid?: string;
  name?: string;
  photoURL?: string;
}
