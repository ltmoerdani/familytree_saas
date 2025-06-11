# Implementasi Standar Genealogy Tree

## Deskripsi
Implementasi standar genealogy tree dengan garis koneksi yang mengikuti prinsip-prinsip genealogi tradisional. Sistem ini menyediakan visualisasi silsilah keluarga yang jelas dan terorganisir dengan koneksi yang intuitif.

## Fitur Utama

### 1. Komponen GenealogyConnections
- **Lokasi**: `src/components/ui/GenealogyConnections.jsx`
- **Fungsi**: Menggambar garis koneksi genealogi standar
- **Fitur**:
  - Garis pernikahan horizontal dengan koneksi vertikal
  - Sistem T-junction untuk multiple anak
  - Garis generasi dengan indikator visual
  - Validasi hubungan untuk mencegah duplikasi

### 2. Utilitas Layout Genealogi
- **Lokasi**: `src/utils/genealogyLayout.js`
- **Fungsi**: Mengelola positioning dan layout tree
- **Fitur**:
  - Auto-arrangement berdasarkan generasi
  - Positioning optimal untuk pasangan
  - Validasi hubungan keluarga
  - Perhitungan bounding box

### 3. Hook useGenealogyTree
- **Lokasi**: `src/hooks/useGenealogyTree.js`
- **Fungsi**: State management untuk genealogy tree
- **Fitur**:
  - CRUD operations untuk anggota keluarga
  - Management hubungan (pernikahan, anak-orang tua)
  - History management (undo/redo)
  - Search dan filter functionality

### 4. Komponen FamilyMemberCard
- **Lokasi**: `src/components/ui/FamilyMemberCard.jsx`
- **Fungsi**: Kartu visual untuk anggota keluarga
- **Fitur**:
  - Tema warna berdasarkan gender
  - Indikator status hidup/meninggal
  - Informasi relasi (spouse, children)
  - Interactive selection dan drag

## Standar Koneksi Genealogi

### 1. Garis Pernikahan
```
Member1 ——————— Member2
   |               |
   |———————————————|
           |
       (children)
```

### 2. Garis Orang Tua-Anak (Single Child)
```
    Parent1 ——— Parent2
         |
         |
       Child
```

### 3. Garis Orang Tua-Anak (Multiple Children)
```
    Parent1 ——— Parent2
         |
         |
    |————|————|
    |    |    |
  Child1 Child2 Child3
```

## Konfigurasi Layout

### Konstanta Layout (LAYOUT_CONFIG)
```javascript
{
  CARD_WIDTH: 120,
  CARD_HEIGHT: 140,
  GENERATION_GAP: 200,
  SIBLING_GAP: 150,
  MARRIAGE_GAP: 50,
  PARENT_CHILD_VERTICAL_GAP: 60,
  CONNECTION_OFFSET: 30
}
```

## Penggunaan

### 1. Basic Setup
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

### 2. Menambah Anggota Keluarga
```javascript
const newMember = addMember({
  firstName: 'John',
  lastName: 'Doe',
  birthDate: '1990-01-01',
  generation: 2,
  gender: 'male'
});
```

### 3. Menambah Hubungan Pernikahan
```javascript
addMarriage(member1Id, member2Id);
```

### 4. Menambah Anak
```javascript
const child = addChild(parentId, {
  firstName: 'Jane',
  lastName: 'Doe',
  birthDate: '2020-01-01',
  gender: 'female'
});
```

## Validasi Data

### Struktur Data Anggota
```javascript
{
  id: 'unique-id',
  firstName: 'string',
  lastName: 'string',
  birthDate: 'YYYY-MM-DD',
  deathDate: 'YYYY-MM-DD' | null,
  generation: number,
  gender: 'male' | 'female',
  x: number,
  y: number,
  spouseId: 'spouse-id' | null,
  children: ['child-id-1', 'child-id-2'],
  parents: ['parent-id-1', 'parent-id-2']
}
```

### Validasi Hubungan
- Spouse relationship harus mutual
- Parent-child relationship harus mutual
- Generasi anak harus lebih tinggi dari orang tua
- Tidak boleh ada circular reference

## Performance Optimization

### 1. Memoization
- useMemo untuk calculated values
- useCallback untuk event handlers
- React.memo untuk komponen

### 2. Virtual Scrolling
- Implementasi untuk tree besar (>1000 anggota)
- Lazy loading untuk generasi yang tidak terlihat

### 3. Canvas Optimization
- Layer separation untuk koneksi dan kartu
- Efficient re-rendering dengan Konva

## Testing

### Unit Tests
- Validasi relationship logic
- Layout calculation accuracy
- State management functionality

### Integration Tests
- Component interaction
- Canvas rendering
- Data persistence

## Roadmap

### Phase 1 (Current)
- ✅ Basic genealogy connections
- ✅ Family member cards
- ✅ State management
- ✅ Layout utilities

### Phase 2 (Next)
- [ ] Advanced drag & drop
- [ ] Auto-layout algorithm
- [ ] Export functionality
- [ ] Print optimization

### Phase 3 (Future)
- [ ] Timeline view
- [ ] Photo integration
- [ ] Collaborative editing
- [ ] Mobile responsiveness

## Troubleshooting

### Common Issues

1. **Garis tidak muncul**
   - Pastikan familyMembers memiliki relationship data
   - Check konsol untuk validation errors

2. **Layout tidak optimal**
   - Jalankan autoArrangeLayout()
   - Adjust LAYOUT_CONFIG constants

3. **Performance lambat**
   - Implementasikan virtual scrolling
   - Reduce re-renders dengan memoization

## Contributing

1. Follow coding style guidelines
2. Write unit tests untuk fitur baru
3. Update dokumentasi
4. Submit PR dengan deskripsi yang jelas

## References

- [Genealogy Standards](https://www.familysearch.org/wiki/en/Genealogy_Standards)
- [Family Tree Visualization](https://en.wikipedia.org/wiki/Family_tree)
- [Konva.js Documentation](https://konvajs.org/docs/)
- [React Performance](https://react.dev/learn/render-and-commit)
