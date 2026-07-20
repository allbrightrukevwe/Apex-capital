'use client';

import { useRouter, usePathname } from 'next/navigation';

export const useSmoothScroll = () => {
  const router = useRouter();
  const pathname = usePathname();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleNavigation = (href: string, e?: React.MouseEvent) => {
    e?.preventDefault();

    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      
      if (pathname !== '/' && path !== '') {
        router.push('/');
        setTimeout(() => {
          scrollToSection(hash);
        }, 500);
      } else {
        scrollToSection(hash);
      }
    } else {
      router.push(href);
    }
  };

  return { handleNavigation, scrollToSection };
};