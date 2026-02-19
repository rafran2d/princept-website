# Système d'Édition Inline Multilingue

Ce système permet d'éditer du texte directement depuis l'interface client avec mise à jour automatique de la base de données selon la langue sélectionnée.

## Composants créés

### 1. `InlineTextEditor.js`
Composant principal pour l'édition inline avec support multilingue.

**Props :**
- `value` : Valeur actuelle (string ou objet multilingue)
- `sectionId` : ID de la section à modifier
- `fieldPath` : Chemin du champ (ex: "title", "contact.email")
- `onSave` : Callback appelé lors de la sauvegarde
- `placeholder` : Texte d'aide
- `tag` : Element HTML à utiliser ('div', 'h1', 'p', etc.)
- `multiline` : Boolean pour textarea vs input
- `disabled` : Désactiver l'édition
- `className`, `style` : Styles personnalisés

### 2. `useInlineEditor.js`
Hook React pour faciliter la gestion des éditions.

**Méthodes :**
- `updateSectionField(fieldPath, newValue)` : Met à jour un champ
- `updateMultilingualField(fieldPath, value, languageId)` : Met à jour un champ multilingue
- `createInlineEditorProps(fieldPath, options)` : Crée les props pour InlineTextEditor

### 3. `EditableText.js`
Composants simplifiés pour différents types de texte :
- `EditableTitle` : Titres (h2)
- `EditableSubtitle` : Sous-titres (h3)
- `EditableDescription` : Descriptions (p multiline)
- `EditableButton` : Texte de bouton (span)
- `EditableHeading` : Titres personnalisés (h1-h6)

## Utilisation

### 1. Import des styles CSS
```jsx
import '../styles/inline-editor.css';
```

### 2. Utilisation basique
```jsx
import { EditableTitle, EditableDescription } from '../EditableText';

// Dans votre composant section
<EditableTitle
  sectionId={section.id}
  fieldPath="title"
  placeholder="Titre de la section"
/>

<EditableDescription
  sectionId={section.id}
  fieldPath="description"
  placeholder="Description de la section"
/>
```

### 3. Utilisation avec hook
```jsx
import { useInlineEditor } from '../hooks/useInlineEditor';
import InlineTextEditor from '../InlineTextEditor';

const MyComponent = ({ section }) => {
  const { createInlineEditorProps } = useInlineEditor(section.id);

  return (
    <InlineTextEditor
      {...createInlineEditorProps('title', {
        placeholder: 'Titre personnalisé',
        tag: 'h1',
        className: 'mon-titre'
      })}
    />
  );
};
```

### 4. Champs imbriqués
```jsx
// Pour un champ comme section.contact.email
<EditableText
  sectionId={section.id}
  fieldPath="contact.email"
  placeholder="Email de contact"
/>
```

## Fonctionnalités

### Multilingue automatique
- Détecte automatiquement la langue courante
- Stocke les valeurs par langue : `{ fr: "Bonjour", en: "Hello" }`
- Affiche la valeur dans la langue sélectionnée
- Fallback vers la langue par défaut si traduction manquante

### Sauvegarde en base
- Utilise l'API backend pour sauvegarder en temps réel
- Compatible avec MySQL et SQLite (mode dégradé)
- Gestion d'erreurs avec messages utilisateur
- Retry automatique en cas d'échec réseau

### Interface utilisateur
- Survol pour indiquer les zones éditables
- Clic pour entrer en mode édition
- Raccourcis clavier :
  - `Entrée` : Sauvegarder (input simple)
  - `Ctrl+Entrée` : Sauvegarder (textarea)
  - `Échap` : Annuler
- Validation visuelle (bordures, couleurs)
- Indicateurs de chargement

### Gestion d'état
- Synchronisation avec le store global
- Mise à jour en temps réel des autres composants
- Préservation de l'état lors du changement de langue

## Architecture technique

### Flux de données
1. **Affichage** : Valeur récupérée depuis le store → contexte langue → affichage localisé
2. **Édition** : Clic → mode édition → saisie utilisateur
3. **Sauvegarde** : Validation → API call → mise à jour store → re-render

### Gestion des erreurs
- Connexion API indisponible : mode dégradé local
- Erreur sauvegarde : message d'erreur + retry
- Validation côté client : champs requis, formats

### Performance
- Debouncing des sauvegardes automatiques
- Mise à jour incrémentale du store
- Lazy loading des traductions

## Exemple d'implémentation complète

Voir `ContactSectionEditable.js` pour un exemple d'intégration dans une section existante.

```jsx
// Exemple minimal
import { EditableTitle, EditableDescription } from '../EditableText';

const MaSection = ({ section, isEditing }) => {
  return (
    <div>
      {isEditing ? (
        <>
          <EditableTitle
            sectionId={section.id}
            fieldPath="title"
            className="text-4xl font-bold"
          />
          <EditableDescription
            sectionId={section.id}
            fieldPath="description"
            className="text-lg text-gray-600"
          />
        </>
      ) : (
        <>
          <h1>{section.title}</h1>
          <p>{section.description}</p>
        </>
      )}
    </div>
  );
};
```

## Migration des sections existantes

1. Identifier les textes éditables
2. Remplacer par les composants EditableText
3. Ajouter la prop `isEditing` pour contrôler le mode
4. Tester la sauvegarde et la gestion multilingue

## Limitations actuelles

- Pas d'édition de listes/tableaux complexes
- Pas d'édition d'images inline
- Pas d'historique des modifications
- Pas de collaboration temps réel

## Évolutions futures

- Support des médias (images, vidéos)
- Édition de structures complexes (listes, objets)
- Prévisualisation en temps réel
- Système de versioning
- Collaboration multi-utilisateur