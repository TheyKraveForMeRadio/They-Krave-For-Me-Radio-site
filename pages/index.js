import Head from 'next/head'
import Header from '../components/Header'
import LivePlayer from '../components/LivePlayer'
import MixtapeStore from '../components/MixtapeStore'
import DJs from '../components/DJs'
import Spotlights from '../components/Spotlights'
import NewsSection from '../components/NewsSection'
import Merch from '../components/Merch'
import ChatBox from '../components/ChatBox'
import Link from 'next/link'

export default function Home() {
  const sampleTracks = ['DJ Krave – Late Night Mix']
  const djs = [
    { name: 'DJ Krave', slot: '10PM–2AM', bio: 'Late night mixes & freestyle', img: '/djs/krave.jpg' },
    { name: 'Layla Stacks', slot: '2PM–6PM', bio: 'Smooth R&B mixes', img: '/djs/layla.jpg' },
  ]
  const artists = [
    { name: 'Velvet Noir', description: 'Rising neo-soul star', img: '/artists/velvet.jpg', link: '#' },
    { name: 'Big Trap', description: 'Street stories & hits', img: '/artists/bigtrap.jpg', link: '#' },
  ]
  const merch = [
    { name: 'Neon Hoodie', price: '$48', img: '/merch/hoodie.jpg' },
    { name: 'TKFM Cap', price: '$22', img: '/merch/cap.jpg' },
  ]
  const mixtapes = [
    { title: 'Krave Vol. 1', price: '$8', img: '/mixtapes/vol1.jpg', preview: '' }
  ]

  return (
    <>
      <Head>
        <title>They Krave For Me Radio</title>
        <meta name="description" content="24/7 Hip-Hop • R&B • Culture" />
      </Head>
      <Header />
      <main className="container">
        <LivePlayer tracks={sampleTracks} />
        <DJs list={djs} />
        <Spotlights artists={artists} />
        <NewsSection />
        <Merch items={merch} />
        <MixtapeStore mixtapes={mixtapes} />
        <section style={{padding:24, textAlign:'center'}}>
          <Link href="/admin"><a style={{background:'#a200ff',color:'#fff',padding:'8px 12px',borderRadius:6}}>Admin / Upload</a></Link>
        </section>
        <ChatBox />
      </main>
    </>
  )
}
