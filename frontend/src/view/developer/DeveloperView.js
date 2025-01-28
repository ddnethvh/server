import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BiWrench, 
  BiEdit,
  BiTrash, 
  BiPlus,
  BiSave,
  BiUpArrow,
  BiDownArrow,
  BiReset,
} from 'react-icons/bi';
import NavBar from '../../components/NavBar/NavBar';
import './DeveloperView.css';
import Editor from '../../components/Editor/Editor';
import { MarkdownRenderer } from '../../components/Editor/Editor';

const DeveloperView = () => {
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingName, setEditingName] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const { categoryId, pageId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const storedDocs = localStorage.getItem('developer-docs');
    if (storedDocs) {
      const data = JSON.parse(storedDocs);
      setDocs(data);
      setLoading(false);
      
      // Set default page if none selected
      if (!categoryId && !pageId && data.categories[0]?.pages[0]) {
        const defaultCategory = data.categories[0];
        const defaultPage = defaultCategory.pages[0];
        navigate(`/developer/${defaultCategory.id}/${defaultPage.id}`);
      }
    } else {
      fetch('/developer-docs.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch documentation');
          }
          return response.json();
        })
        .then(data => {
          setDocs(data);
          localStorage.setItem('developer-docs', JSON.stringify(data));
          setLoading(false);
          
          // Set default page if none selected
          if (!categoryId && !pageId && data.categories[0]?.pages[0]) {
            const defaultCategory = data.categories[0];
            const defaultPage = defaultCategory.pages[0];
            navigate(`/developer/${defaultCategory.id}/${defaultPage.id}`);
          }
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [categoryId, pageId, navigate]);

  useEffect(() => {
    if (docs && categoryId && pageId) {
      const category = docs.categories.find(c => c.id === categoryId);
      const page = category?.pages.find(p => p.id === pageId);
      setActivePage(page);
    }
  }, [docs, categoryId, pageId]);

  const renderCodeBlock = (codeBlock) => {
    if (!codeBlock) return null;
    return (
      <div className="code-block">
        <pre>
          <code>
            {`// ${codeBlock.title}\n${codeBlock.code}`}
          </code>
        </pre>
      </div>
    );
  };

  const renderList = (items) => {
    if (!items) return null;
    return (
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  const renderSubsection = (subsection) => {
    return (
      <div key={subsection.title} className="subsection">
        <h3>{subsection.title}</h3>
        <p>{subsection.content}</p>
        {renderList(subsection.listItems)}
      </div>
    );
  };

  const handleSave = () => {
    const blob = new Blob([JSON.stringify(docs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'developer-docs.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setHasChanges(false);
  };

  const updateDocs = (newDocs) => {
    setDocs(newDocs);
    setHasChanges(true);
    localStorage.setItem('developer-docs', JSON.stringify(newDocs));
  };

  const deleteCategory = (categoryId) => {
    const newDocs = {
      ...docs,
      categories: docs.categories.filter(c => c.id !== categoryId)
    };
    updateDocs(newDocs);
  };

  const deletePage = (categoryId, pageId) => {
    const newDocs = {
      ...docs,
      categories: docs.categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            pages: category.pages.filter(p => p.id !== pageId)
          };
        }
        return category;
      })
    };
    updateDocs(newDocs);
    navigate(`/developer/${docs.categories[0].id}/${docs.categories[0].pages[0].id}`);
  };

  const deleteSection = (categoryId, pageId, sectionIndex) => {
    const newDocs = {
      ...docs,
      categories: docs.categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            pages: category.pages.map(page => {
              if (page.id === pageId) {
                return {
                  ...page,
                  sections: page.sections.filter((_, idx) => idx !== sectionIndex)
                };
              }
              return page;
            })
          };
        }
        return category;
      })
    };
    updateDocs(newDocs);
  };

  const addCategory = () => {
    const newId = `category-${Date.now()}`;
    const newDocs = {
      ...docs,
      categories: [
        ...docs.categories,
        {
          id: newId,
          name: 'New Category',
          pages: []
        }
      ]
    };
    updateDocs(newDocs);
  };

  const addPage = (categoryId) => {
    const newId = `page-${Date.now()}`;
    const newDocs = {
      ...docs,
      categories: docs.categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            pages: [
              ...category.pages,
              {
                id: newId,
                name: 'New Page',
                sections: []
              }
            ]
          };
        }
        return category;
      })
    };
    updateDocs(newDocs);
    navigate(`/developer/${categoryId}/${newId}`);
  };

  const addSection = () => {
    const newDocs = {
      ...docs,
      categories: docs.categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            pages: category.pages.map(page => {
              if (page.id === pageId) {
                return {
                  ...page,
                  sections: [
                    ...page.sections,
                    {
                      title: 'New Section',
                      content: 'Add content here'
                    }
                  ]
                };
              }
              return page;
            })
          };
        }
        return category;
      })
    };
    updateDocs(newDocs);
  };

  const handlePageNameEdit = (categoryId, pageId, newName, event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const newDocs = {
        ...docs,
        categories: docs.categories.map(category => {
          if (category.id === categoryId) {
            return {
              ...category,
              pages: category.pages.map(page => {
                if (page.id === pageId) {
                  return {
                    ...page,
                    name: newName
                  };
                }
                return page;
              })
            };
          }
          return category;
        })
      };
      updateDocs(newDocs);
      setEditingName(null);
    } else if (event.key === 'Escape') {
      setEditingName(null);
    }
  };

  const moveSection = (direction) => {
    const newDocs = {
      ...docs,
      categories: docs.categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            pages: category.pages.map(page => {
              if (page.id === pageId) {
                const sections = [...page.sections];
                const newIndex = direction.type === 'up' ? direction.index - 1 : direction.index + 1;

                if (newIndex >= 0 && newIndex < sections.length) {
                  const temp = sections[direction.index];
                  sections[direction.index] = sections[newIndex];
                  sections[newIndex] = temp;
                }

                return {
                  ...page,
                  sections
                };
              }
              return page;
            })
          };
        }
        return category;
      })
    };
    updateDocs(newDocs);
  };

  const handleSectionEdit = (sectionIndex, updatedContent) => {
    const newDocs = {
      ...docs,
      categories: docs.categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            pages: category.pages.map(page => {
              if (page.id === pageId) {
                const sections = [...page.sections];
                sections[sectionIndex] = {
                  ...sections[sectionIndex],
                  content: updatedContent
                };
                return {
                  ...page,
                  sections
                };
              }
              return page;
            })
          };
        }
        return category;
      })
    };
    updateDocs(newDocs);
  };

  const renderSection = (section, index) => {
    return (
      <div key={section.title} className="doc-section">
        {editMode && editingSection !== index && (
          <div className="section-controls">
            <div className="section-move-controls">
              <BiUpArrow 
                title="Move Up"
                onClick={() => moveSection({ type: 'up', index })}
                className={index === 0 ? 'disabled' : ''}
              />
              <BiDownArrow 
                title="Move Down"
                onClick={() => moveSection({ type: 'down', index })}
                className={activePage && index === activePage.sections.length - 1 ? 'disabled' : ''}
              />
            </div>
            <div className="section-actions">
              <BiEdit 
                title="Edit Section" 
                onClick={() => setEditingSection(index)}
              />
              <BiTrash 
                title="Delete Section" 
                onClick={() => deleteSection(categoryId, pageId, index)}
              />
            </div>
          </div>
        )}
        {editingSection === index ? (
          <Editor
            content={section.content}
            onChange={(content) => handleSectionEdit(index, content)}
            onSave={() => setEditingSection(null)}
          />
        ) : (
          <>
            <h2>{section.title}</h2>
            {section.content && <MarkdownRenderer content={section.content} />}
            {section.codeBlock && renderCodeBlock(section.codeBlock)}
            {section.subsections && section.subsections.map(renderSubsection)}
            {section.listItems && renderList(section.listItems)}
            {section.warning && <p className="warning">{section.warning}</p>}
            {section.footer && <p>{section.footer}</p>}
          </>
        )}
      </div>
    );
  };

  const renderSideNav = () => {
    if (!docs) return null;
    return (
      <div className="doc-sidebar">
        <div className="sidebar-content">
          {docs.categories.map(category => (
            <div key={category.id} className="sidebar-category">
              <div className="category-header">
                <h3>{category.name}</h3>
                {editMode && (
                  <div className="category-controls">
                    <BiEdit title="Edit Category" />
                    <BiTrash 
                      title="Delete Category" 
                      onClick={() => deleteCategory(category.id)}
                    />
                    <BiPlus 
                      title="Add Page" 
                      onClick={() => addPage(category.id)}
                    />
                  </div>
                )}
              </div>
              <ul>
                {category.pages.map(page => (
                  <li 
                    key={page.id}
                    className={
                      categoryId === category.id && pageId === page.id 
                        ? 'active' 
                        : ''
                    }
                  >
                    {editingName === `${category.id}-${page.id}` ? (
                      <input
                        type="text"
                        className="page-name-input"
                        defaultValue={page.name}
                        autoFocus
                        onKeyDown={(e) => handlePageNameEdit(category.id, page.id, e.target.value, e)}
                        onBlur={() => setEditingName(null)}
                      />
                    ) : (
                      <span onClick={() => navigate(`/developer/${category.id}/${page.id}`)}>
                        {page.name}
                      </span>
                    )}
                    {editMode && (
                      <div className="page-controls">
                        <BiEdit 
                          title="Edit Page Name" 
                          onClick={() => setEditingName(`${category.id}-${page.id}`)}
                        />
                        <BiTrash 
                          title="Delete Page" 
                          onClick={() => deletePage(category.id, page.id)}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {editMode && (
            <button className="add-category-btn" onClick={addCategory}>
              <BiPlus /> Add Category
            </button>
          )}
        </div>
        <div className="sidebar-footer">
          <button 
            className={`edit-mode-toggle ${editMode ? 'active' : ''}`}
            onClick={() => setEditMode(!editMode)}
            title="Toggle Edit Mode"
          >
            <BiWrench />
          </button>
          {editMode && (
            <>
              <button 
                className="reset-button"
                onClick={resetDocs}
                title="Reset to Original"
              >
                <BiReset />
              </button>
              {hasChanges && (
                <button 
                  className="save-button"
                  onClick={handleSave}
                  title="Save Changes"
                >
                  <BiSave />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // A reset function to restore original data
  const resetDocs = () => {
    localStorage.removeItem('developer-docs');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="cyber-spinner"></div>
        <p>Loading documentation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      
      <div className="doc-container">
        {renderSideNav()}
        
        <section className="doc-content">
          <div className="section-content">
            {activePage && (
              <>
                {activePage.sections.map(renderSection)}
                {editMode && (
                  <button className="add-section-btn" onClick={addSection}>
                    <BiPlus /> Add Section
                  </button>
                )}
              </>
            )}
            {!activePage && editMode && (
              <div className="empty-page-message">
                <p>This page is empty. Add some sections to get started.</p>
                <button className="add-section-btn" onClick={addSection}>
                  <BiPlus /> Add Section
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DeveloperView; 