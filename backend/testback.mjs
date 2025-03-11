import { getAllMoviesSortedByDate } from './backend.mjs' ;
import { getAllActivitesSortedByDate } from './backend.mjs' ;
import { getAllActeurAndRealisateurSortedByNom } from './backend.mjs' ;
import { getFilmById } from './backend.mjs' ;
import { getActivitesById } from './backend.mjs' ;
import { getInviteById } from './backend.mjs' ;
import { getActiviteByAnimateurId } from './backend.mjs' ;
import { getActiviteByAnimateurName } from './backend.mjs' ;
import { UpdateFilmById } from './backend.mjs' ;
import { UpdateActivitesById } from './backend.mjs' ;
import { UpdateInviteById } from './backend.mjs' ;

try {
    const movies = await getAllMoviesSortedByDate() ;
    console.log(movies) ;
} catch (e) {
    console.error(e) ;
}

try {
    const activites = await getAllActivitesSortedByDate() ;
    console.log(activites) ;
} catch (e) {
    console.error(e) ;
}

try {
    const invites = await getAllActeurAndRealisateurSortedByNom() ;
    console.log(invites) ;
}
catch (e) {
    console.error(e) ;
}

try {
    const film = await getFilmById('ID D UN FILM') ;
    console.log(film) ;
}
catch (e) {
    console.error(e) ;
}

try {
    const activite = await getActivitesById('ID D UNE ACTIVITE') ;
    console.log(activite) ;
}
catch (e) {
    console.error(e) ;
}

try {
    const invite = await getInviteById('ID D UN INVITE') ;
    console.log(invite) ;
}
catch (e) {
    console.error(e) ;
}
   

try {
    const activite = await getActiviteByAnimateurId('ID D UN ANIMATEUR') ;
    console.log(activite) ;
} catch (e) {
    console.error(e) ;
}

try {
    const activite = await getActiviteByAnimateurId('LE NOM D UN ANIMATEUR') ;
    console.log(activite) ;
}
catch (e) {
    console.error(e) ;
}