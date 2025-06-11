# Family Tree SaaS

Aplikasi SaaS untuk membuat dan mengelola pohon silsilah keluarga dengan implementasi standar genealogy tree dan garis koneksi yang mengikuti prinsip genealogi tradisional.

## 🚀 Fitur Utama

### ✨ Genealogy Tree dengan Standar Koneksi
- **Garis Pernikahan**: Koneksi horizontal dengan T-junction
- **Garis Orang Tua-Anak**: Sistem vertikal dengan multiple children support
- **Layout Otomatis**: Auto-arrangement berdasarkan generasi
- **Interactive Cards**: Drag & drop, selection, dan editing

### 🎨 UI/UX Modern
- **Responsive Design**: Optimized untuk desktop dan mobile
- **Dark/Light Theme**: Support untuk preferensi pengguna
- **Smooth Animations**: Menggunakan Framer Motion
- **Accessible**: Mengikuti standar accessibility (a11y)

### 🛠️ Management Tools
- **Import/Export**: Support CSV, GEDCOM, JSON
- **Version Control**: Undo/redo functionality
- **Search & Filter**: Pencarian anggota keluarga
- **Collaboration**: Multi-user editing support

## 🏗️ Teknologi

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety (ongoing migration)
- **Tailwind CSS** - Styling framework
- **Konva.js** - Canvas rendering untuk tree
- **React Router** - Client-side routing
- **Framer Motion** - Animations

### State Management
- **Zustand** - Lightweight state management
- **React Query** - Server state management
- **Custom Hooks** - Business logic abstraction

### Testing
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **MSW** - API mocking

## 📁 Struktur Proyek

```
src/
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── GenealogyConnections.jsx
│   │   ├── FamilyMemberCard.jsx
│   │   └── GenealogyTreeDemo.jsx
│   └── AppIcon.jsx
├── hooks/
│   ├── useGenealogyTree.js     # Tree state management
│   └── useDragAndDrop.js       # Drag & drop functionality
├── utils/
│   └── genealogyLayout.js      # Layout calculations
├── pages/
│   ├── dashboard/              # Dashboard page
│   ├── family-tree-canvas/     # Main tree editor
│   ├── member-profile/         # Member details
│   ├── import-data/           # Data import tools
│   └── export-share/          # Export & sharing
└── docs/                      # Technical documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm atau yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd familytree_saas

# Install dependencies
npm install

# Start development server
npm run dev
```

### Demo Mode
Untuk melihat implementasi genealogy tree:
```bash
# Buka browser ke:
http://localhost:4028/demo
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📖 Implementasi Genealogy Tree

### Standar Koneksi

#### 1. Garis Pernikahan
```
Member1 ——————— Member2
   |               |
   |———————————————|
           |
       (children)
```

#### 2. Single Child
```
    Parent1 ——— Parent2
         |
         |
       Child
```

#### 3. Multiple Children
```
    Parent1 ——— Parent2
         |
         |
    |————|————|
    |    |    |
  Child1 Child2 Child3
```

### Penggunaan Komponen

```jsx
import { useGenealogyTree } from 'hooks/useGenealogyTree';
import GenealogyConnections from 'components/ui/GenealogyConnections';
import FamilyMemberCard from 'components/ui/FamilyMemberCard';

const FamilyTree = () => {
  const {
    familyMembers,
    selectedMember,
    setSelectedMember,
    addMember,
    updateMember
  } = useGenealogyTree(initialData);

  return (
    <Stage>
      <Layer>
        <GenealogyConnections familyMembers={familyMembers} />
        {familyMembers.map(member => (
          <FamilyMemberCard 
            key={member.id} 
            member={member}
            onSelect={setSelectedMember}
          />
        ))}
      </Layer>
    </Stage>
  );
};
```

## 🔧 Konfigurasi

### Layout Configuration
```javascript
// src/utils/genealogyLayout.js
export const LAYOUT_CONFIG = {
  CARD_WIDTH: 120,
  CARD_HEIGHT: 140,
  GENERATION_GAP: 200,
  SIBLING_GAP: 150,
  MARRIAGE_GAP: 50
};
```

### Environment Variables
```bash
# .env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development
```

## 📚 Dokumentasi

- [Implementasi Genealogy Tree](./docs/genealogy-tree-implementation.md)
- [API Documentation](./docs/api.md)
- [Component Guide](./docs/components.md)
- [Testing Guide](./docs/testing.md)

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Coding Standards
- Follow React best practices
- Use TypeScript untuk type safety
- Write unit tests untuk fitur baru
- Follow Tailwind CSS conventions
- Use semantic commit messages

## 🐛 Bug Reports

Gunakan [GitHub Issues](https://github.com/username/familytree_saas/issues) untuk melaporkan bug atau request fitur.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Library
- [Konva.js](https://konvajs.org/) - 2D Canvas Library
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [FamilySearch](https://www.familysearch.org/) - Genealogy Standards

## 📞 Support

- Email: support@familytree-saas.com
- Documentation: [docs.familytree-saas.com](https://docs.familytree-saas.com)
- Community: [community.familytree-saas.com](https://community.familytree-saas.com)
