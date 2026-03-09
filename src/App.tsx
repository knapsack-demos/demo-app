import { useState } from 'react'
import { Button, Card, Text } from '@knapsack/sandbox-components/react'
import { Author, Badge } from '@knapsack-cloud/demo'
import './App.css'

type Theme = 'arcadiaLight' | 'arcadiaDark' | 'basisLight' | 'basisDark' | 'Knapsack'

function App() {
  const [count, setCount] = useState(0)
  const [theme, setTheme] = useState<Theme>('arcadiaLight')

  return (
    <div
      data-collections-theme={theme}
      style={{ backgroundColor: 'var(--background-page)', minHeight: '100vh', minWidth: '100vw', display: 'flex', justifyContent: 'start', alignItems: 'center' }}
    >
      <div style={{maxWidth: 800, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', }}>

      <Text type="title">Component Showcase</Text>
      <Text type="subtitle">@knapsack/sandbox-components &amp; @knapsack-cloud/demo</Text>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <label htmlFor="theme-select" style={{ fontWeight: 500 }}>Theme:</label>
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          style={{ padding: '0.25rem 0.5rem', borderRadius: 4, border: '1px solid #ccc', backgroundColor: 'var(--color-background-primary)' }}
        >
          <option value="arcadiaLight">arcadiaLight</option>
          <option value="arcadiaDark">arcadiaDark</option>
          <option value="basisLight">basisLight</option>
          <option value="basisDark">basisDark</option>
          <option value="Knapsack">Knapsack</option>
        </select>
      </div>

      {/* Button */}
      <section>
        <Text type="headingMedium" spacingBottom="small">Button</Text>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button label="Default" />
          <Button label="Outlined" type="outlined" />
          <Button label="Success" mode="success" />
          <Button label="Error" mode="error" />
          <Button label="Small" size="small" />
          <Button label="Large" size="large" />
        </div>
      </section>

      {/* Counter */}
      <section>
        <Text type="headingMedium" spacingBottom="small">Button — Click Counter</Text>
        <div onClick={() => setCount((c) => c + 1)} style={{ display: 'inline-block', cursor: 'pointer' }}>
          <Button label={`Clicked ${count} time${count === 1 ? '' : 's'}`} />
        </div>
      </section>

      {/* Badge */}
      <section>
        <Text type="headingMedium" spacingBottom="small">Badge</Text>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Badge variant="default">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
        </div>
      </section>

      {/* Card */}
      <section>
        <Text type="headingMedium" spacingBottom="small">Card</Text>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Card title="Simple Card" description="A basic card with a title and description." />
          <Card title="Card with Content" description="Cards can also contain children.">
            <Button label="Learn More" size="small" type="outlined" />
          </Card>
          <Card
            title="Card with Image"
            description="Cards support a top image via the imgUrl prop."
            imgUrl="https://picsum.photos/seed/alpine/600/300"
          />
        </div>
      </section>

      {/* Author */}
      <section style={{ backgroundColor: 'var(--color-neutral-300)', borderRadius: 'var(--radius-medium)', padding: '1rem' }}>
        <Text type="headingMedium" spacingBottom="small">Author</Text>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Author imgSrc="https://api.dicebear.com/9.x/adventurer/svg?seed=Jane&backgroundColor=b6e3f4" date="July 5, 2025" read="5 min read" role="Design Engineer">
            Jane Smith
          </Author>
          <Author imgSrc="https://api.dicebear.com/9.x/adventurer/svg?seed=John&backgroundColor=c0aede" date="January 2, 2026" read="3 min" layout="reversed" noBorder>
            John Doe
          </Author>
        </div>
      </section>
      </div>
    </div>
  )
}

export default App
