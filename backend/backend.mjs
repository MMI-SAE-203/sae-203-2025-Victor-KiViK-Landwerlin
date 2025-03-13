import PocketBase from 'pocketbase' ;
const pb = new PocketBase('http://127.0.0.1:8090') ;

export async function getAllMoviesSortedByDate() {
    const records = await pb.collection('film').getFullList({
        sort: 'date_projection',
    });
    return records;
}

export async function getAllActivitesSortedByDate() {
    const records = await pb.collection('activite').getFullList({
        sort: 'date',
    });
    return records;
}

export async function getAllActeurAndRealisateurSortedByNom() {
    const records = await pb.collection('invite').getFullList({sort: 'nom'}, {filter: "role = 'realisateur'||role = 'acteur'"});
    return records;
}

export async function getFilmById(id) {
    const record = await pb.collection('film').getOne(id);
    return record;
}

export async function getActivitesById(id) {
    const record = await pb.collection('activite').getOne(id);
    return record;
}

export async function getInviteById(id) {
    const record = await pb.collection('invite').getOne(id);
    return record;
}

export async function getActiviteByAnimateurId(id) {
    const records = await pb.collection('activite').getFullList({filter: `animateur.id ='${id}'`, expand: 'invite'});
    return records;
}

export async function getActiviteByAnimateurName(nom) {
    const records = await pb.collection('activite').getFullList({
        filter: `animateur.nom ='${nom}'`, expand: 'invite'
    });
    return records;
}

export async function UpdateFilmById(id, data) {
    const record = await pb.collection('film').update(id, data);
    return record;
}

export async function UpdateActivitesById(id, data) {
    const record = await pb.collection('activite').update(id, data);
    return record;
}

export async function UpdateInviteById(id, data) {
    const record = await pb.collection('invite').update(id, data);
    return record;
}

export async function addFilm(data) {
    const record = await pb.collection('film').create(data);
    return record;
}

export async function addActivite(data) {
    const record = await pb.collection('activite').create(data);
    return record;
}

export async function addInvite(data) {
    const record = await pb.collection('invite').create(data);
    return record;
}




////////////////////////////////////////////////////////////////////////////////////

export async function getFilms() {
    try {
        let records = await pb.collection('film').getFullList();
        records = records.map((record) => {
            record.img = pb.files.getURL(record, record.affiche);
            return record;
        });
        return records;
    }
    catch (error) {
        console.log(error);
    }
}

export async function getFilm(id) {
    try {
        let record = await pb.collection('film').getOne(id);
        record.img = pb.files.getURL(record, record.affiche);
        return record;
    }
    catch (error) {
        console.log(error);
    }
}

export async function getInvites() {
    try {
        let records = await pb.collection('invite').getFullList();
        records = records.map((record) => {
            record.img = pb.files.getURL(record, record.photo);
            return record;
        });
        return records;
    }
    catch (error) {
        console.log(error);
    }
}

export async function getInvite(id) {
    try {
        let record = await pb.collection('invite').getOne(id);
        record.img = pb.files.getURL(record, record.photo);
        return record;
    }
    catch (error) {
        console.log(error);
    }
}