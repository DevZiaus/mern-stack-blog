import React from 'react'
import { Footer } from 'flowbite-react'
import { BsFacebook, BsTwitter, BsInstagram, BsGithub } from 'react-icons/bs'
import Logo from './Logo'

export default function FooterCom() {
  return (
    <Footer container className='border-t-8 border-teal-500'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-col-1 gap-5 sm:gap-10'>
          <div className='mt-5 flex-1'>
            <Logo />
            <p className='mt-5'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum incidunt aperiam odit corporis ad. Rerum quas nisi deserunt optio illum pariatur nemo asperiores a neque cupiditate, quis, aliquam sunt tenetur.</p>
          </div>
          <div className='grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6 flex-1'>
            <div>
              <Footer.Title title='About' />
              <Footer.LinkGroup col>
                <Footer.Link href='/about'>
                  About Us
                </Footer.Link>
                <Footer.Link href='https://devziaus.xyz' target='_blank' rel='noopener noreferrer'>
                  DevZiaus
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Follow Us' />
              <Footer.LinkGroup col>
                <Footer.Link href='https://github.com/DevZiaus' target='_blank' rel='noopener noreferrer'>
                  Github
                </Footer.Link>
                <Footer.Link href='https://www.facebook.com/DevZiaus' target='_blank' rel='noopener noreferrer'>
                  Facebook
                </Footer.Link>
                <Footer.Link href='https://www.twitter.com/DevZiaus' target='_blank' rel='noopener noreferrer'>
                  Twitter
                </Footer.Link>
                <Footer.Link href='https://www.instagram.com/DevZiaus' target='_blank' rel='noopener noreferrer'>
                  Instagram
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Legal' />
              <Footer.LinkGroup col>
                <Footer.Link href='#'>
                  Privacy Policy
                </Footer.Link>
                <Footer.Link href='#'>
                  Terms &amp; Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <div>
            <Footer.Copyright href='https://devziaus.xyz' by="DevZiaus" year={new Date().getFullYear()} />
          </div>
          <div className='flex gap-6 mt-4 sm:justify-center'>
            <Footer.Icon href='https://github.com/DevZiaus' target='blank' rel='noopener noreferrer' icon={BsGithub} />
            <Footer.Icon href='https://www.facebook.com/DevZiaus' target='blank' rel='noopener noreferrer' icon={BsFacebook} />
            <Footer.Icon href='https://www.twitter.com/DevZiaus' target='blank' rel='noopener noreferrer' icon={BsTwitter} />
            <Footer.Icon href='https://www.instagram.com/DevZiaus' target='blank' rel='noopener noreferrer' icon={BsInstagram} />
          </div>
        </div>
      </div>
    </Footer>
  )
}

