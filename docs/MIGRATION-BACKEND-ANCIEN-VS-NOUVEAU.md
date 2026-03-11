# Comparaison backend : production-ha.js vs server/

## Vue d’ensemble

Toutes les fonctionnalités exposées par l’ancien backend (`production-ha.js`) ont un équivalent dans le nouveau serveur (`server/`). Les écarts relevés concernent surtout la forme des réponses et quelques détails de compatibilité, qui ont été corrigés où c’était nécessaire.

---

## Routes et fonctionnalités

| Fonctionnalité | Ancien (production-ha.js) | Nouveau (server/) | Statut |
|----------------|----------------------------|-------------------|--------|
| **Check default admin** | `GET /api/check-default-admin` → `{ hasDefaultPassword }` | `GET /api/check-default-admin` → `{ hasDefaultPassword, isDefaultAdmin }` | ✅ Aligné (les deux clés renvoyées) |
| **Health** | `GET /api/health` | `GET /api/health` | ✅ Présent |
| **Monitoring** | `GET /api/monitoring` | `GET /api/monitoring` | ✅ Présent |
| **Langues** | GET/POST/DELETE, active, default, fix-encoding | Idem + GET :id, PUT :id, PATCH toggle, PATCH default, reorder | ✅ Nouveau plus complet |
| **Sections** | GET (filters), POST, PUT :id, DELETE :id | GET, GET :id, POST, PUT :id, DELETE :id | ✅ Présent, même filtres |
| **Site settings** | GET, POST | GET, POST | ✅ Présent |
| **Pages** | GET, GET :slug, POST, PUT :id, DELETE :id | Idem, format réponse aligné (camelCase, title/content parsés) | ✅ Aligné |
| **Themes** | GET, POST | GET, POST, PATCH :id/activate | ✅ Nouveau plus complet |
| **Design settings** | GET, POST | GET, POST | ✅ Présent |
| **User preferences** | GET, POST | GET, POST | ✅ Présent |
| **Backup** | GET export, GET info | GET export, GET info | ✅ Présent |
| **Stats** | GET, GET detailed | GET, GET detailed | ✅ Présent |
| **Email** | POST /api/send-email (Mailjet, SendGrid, SMTP) | POST /api/send-email + POST /api/email/send | ✅ Présent |
| **Auth** | login, verify, logout, change-password, update-profile, profile | Idem (routes auth) | ✅ Présent |

Aucune route ou logique métier propre à l’ancien backend n’a été laissée sans équivalent dans le nouveau.

---

## Corrections de compatibilité effectuées

1. **`/api/check-default-admin`**  
   Le nouveau serveur renvoie maintenant à la fois `hasDefaultPassword` et `isDefaultAdmin` pour rester compatible avec tout code qui lit l’une ou l’autre clé.

2. **Langues – format de réponse**  
   Pour que `apiService.getLanguages()`, `getActiveLanguages()` et `getDefaultLanguage()` (qui utilisent `response.data`) fonctionnent avec le nouveau serveur :
   - `GET /api/languages` → `{ data: [...], meta: { count } }`
   - `GET /api/languages/active` → `{ data: [...] }`
   - `GET /api/languages/default` → `{ data: language }`
   - `POST /api/languages` (création) → `{ data: newLanguage }`

3. **Pages – format de réponse**  
   Le contrôleur pages du nouveau serveur formate désormais les réponses comme l’ancien :
   - camelCase : `isPublished`, `createdAt`, `updatedAt`
   - `title` et `content` parsés (JSON si string)
   - POST/PUT acceptent `isPublished` ou `is_published`, et `title`/`content` en objet ou string (stringifié côté serveur si besoin).

---

## Différences mineures (sans impact fonctionnel)

- **Réponses sections** : ancien `{ data, meta }`, nouveau `{ success: true, data }`. Le front utilise `response.data` dans les deux cas.
- **Health** : l’ancien peut renvoyer `dbInfo` (version MySQL, etc.) ; le nouveau renvoie un format plus simple. Les deux exposent `status` et l’état de la base.
- **Langues – correction d’affichage** : l’ancien appliquait `correctLanguageName()` à la volée sur toutes les réponses langues ; le nouveau s’appuie sur `fix-encoding` et le charset utf8mb4. Si des noms restent mal encodés en base, ils ne sont plus “corrigés” à la volée dans la réponse.

---

## Résumé

- Aucune fonctionnalité de l’ancien backend n’est absente du nouveau.
- Les écarts de format (check-default-admin, langues, pages) ont été traités pour que le front actuel fonctionne avec le serveur dans `server/` sans changement côté front.
- Le nouveau serveur ajoute des routes utiles (langues : get by id, update, toggle, default, reorder ; thèmes : activate).

Pour basculer complètement sur le nouveau backend, il suffit de pointer le front (et l’admin) vers l’URL de l’API du serveur `server/` (ex. `VITE_API_URL`).
