import { useEffect, useState } from 'react';

interface Section {
  id: string;
  title: string;
}

interface Props {
  sections: Section[];
}

export default function LitepaperTOC({ sections }: Props) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observerOptions = {
      rootMargin: '-80px 0px -50% 0px', // 考慮 header 高度（80px）
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    const observer = new IntersectionObserver((entries) => {
      // 找出目前最接近頂部的可見章節
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => {
          const aTop = a.boundingClientRect.top;
          const bTop = b.boundingClientRect.top;
          return aTop - bTop; // 較接近頂部的排在前面
        });

      if (visibleSections.length > 0) {
        const topSection = visibleSections[0];
        setActiveSection(topSection.target.id);
      }
    }, observerOptions);

    // 觀察所有章節
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    // 清理
    return () => {
      observer.disconnect();
    };
  }, [sections]);

  // 更新 TOC 連結的 active 狀態
  useEffect(() => {
    const tocLinks = document.querySelectorAll('.litepaper-toc-link');
    tocLinks.forEach((link) => {
      const sectionId = link.getAttribute('data-section-id');
      if (sectionId === activeSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }, [activeSection]);

  // 這個組件本身不渲染任何內容，只是用來處理邏輯
  // 實際的 TOC UI 由 LitepaperTOC.astro 渲染
  return null;
}

