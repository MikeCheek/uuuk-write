import { getColor } from './arenaSettings'
export const spareParts = [
  {
    id: 'refill',
    nome: 'Refill',
    description: 'Refill di blocchi di fogli (3 blocchi, 60 fogli ciascuno)'
  },
  {
    id: 'sidebar-doppia-a6',
    nome: 'Sidebar Doppia - A6',
    description: 'Sidebar doppia personalizzabile per formato A6',
    personalization: {
      color: getColor('Bianco'),
      text: 'Idee'
    }
  },
  {
    id: 'sidebar-doppia-a5',
    nome: 'Sidebar Doppia - A5',
    description: 'Sidebar doppia personalizzabile per formato A5',
    personalization: {
      color: getColor('Bianco'),
      text: 'Idee'
    }
  },
  {
    id: 'sidebar-a7',
    nome: 'Sidebar - A7',
    description: 'Sidebar personalizzabile per formato A7',
    personalization: {
      color: getColor('Bianco'),
      text: 'Idee'
    }
  },
  {
    id: 'sidebar-a6',
    nome: 'Sidebar - A6',
    description: 'Sidebar personalizzabile per formato A6',
    personalization: {
      color: getColor('Bianco'),
      text: 'Idee'
    }
  },
  {
    id: 'sidebar-a5',
    nome: 'Sidebar - A5',
    description: 'Sidebar personalizzabile per formato A5',
    personalization: {
      color: getColor('Bianco'),
      text: 'Idee'
    }
  },
  {
    id: 'binders',
    nome: 'Binders',
    description: 'Binders di ricambio universali (2 pezzi)'
  }
]
