# 📚 Content Organization

Ce dossier contient tous les fichiers Markdown organisés par catégories pour une meilleure structure et maintenance.

## 📁 Structure des Dossiers

### 🚀 Getting Started
**Dossier : `getting-started/`**
- **00-intro.md** : Introduction à Python et bonnes pratiques
- **01-basics.md** : Variables, types de données et opérateurs
- **02-control.md** : Structures de contrôle et patterns Pythonic

### 💻 Core Programming
**Dossier : `core-programming/`**
- **03-functions.md** : Fonctions, lambdas et décorateurs
- **04-oop.md** : Classes, héritage et programmation orientée objet
- **05-libraries.md** : Bibliothèques populaires (NumPy, Pandas, Matplotlib)

### 📁 File & Web Development
**Dossier : `file-web-dev/`**
- **06-files.md** : Gestion de fichiers, CSV, JSON et context managers
- **07-web.md** : Développement web avec Flask et FastAPI

### 🧪 Testing & Debugging
**Dossier : `testing-debugging/`**
- **08-testing.md** : Tests unitaires, pytest et couverture de code
- **09-debugging.md** : Logging, exceptions et débogage interactif

### ⚡ Performance & Best Practices
**Dossier : `performance-best-practices/`**
- **10-performance.md** : Profilage, optimisation et gestion mémoire
- **11-bestpractices.md** : PEP8, type hints et bonnes pratiques

### 🚀 Advanced Topics
**Dossier : `advanced-topics/`**
- **12-advanced.md** : Concepts avancés (itérateurs, générateurs, métaclasses)
- **13-concurrency.md** : Threading, multiprocessing et async/await
- **14-datascience.md** : Data Science et Machine Learning

### ☁️ Deployment & Security
**Dossier : `deployment-security/`**
- **15-deployment.md** : Déploiement, Docker et CI/CD
- **16-security.md** : Sécurité, validation et bonnes pratiques

### 📋 Reference
**Dossier : `reference/`**
- **cheatsheet.md** : Référence rapide complète de tous les concepts

## 🔄 Génération des Pages HTML

Pour générer les pages HTML à partir de ces fichiers Markdown :

```bash
# Depuis la racine du projet
python src/scripts/create_pages.py
```

## 📝 Modifier le Contenu

1. **Éditez** les fichiers `.md` dans les dossiers appropriés
2. **Exécutez** le script de génération
3. **Les pages HTML** sont automatiquement mises à jour dans `src/pages/`

## 🎯 Avantages de cette Organisation

- **Maintenance facile** : Contenu organisé par thèmes
- **Navigation intuitive** : Structure logique des dossiers
- **Évolutivité** : Facile d'ajouter de nouveaux contenus
- **Collaboration** : Chaque développeur peut travailler sur sa spécialité
- **Documentation claire** : Chaque dossier a un objectif spécifique

## 📖 Navigation

- **Débutants** : Commencez par `getting-started/`
- **Développeurs intermédiaires** : Explorez `core-programming/` et `file-web-dev/`
- **Avancés** : Plongez dans `advanced-topics/`
- **Professionnels** : Consultez `deployment-security/` et `performance-best-practices/`
- **Référence rapide** : Utilisez `reference/cheatsheet.md`
