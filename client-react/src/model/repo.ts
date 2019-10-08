export interface IRepo {
	id: string;
}

class Repo {
	readonly id : string;

	constructor(data : IRepo) {
		this.id = data.id;
	}
}

export default Repo;
