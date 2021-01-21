export class User{
	constructor(
		public _id: string,
		public name: string,
		public created_at:string,
		public email: string,
		public password: string,
		public image: string,
		public role: string,
		public politics: boolean
	){}
}
