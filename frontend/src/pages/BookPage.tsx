import CategoryFilter from '../components/CategoryFilter';
import BookList from '../components/Booklist';
import WelcomeHeader from '../components/WelcomeHeader';
import { useState } from 'react';

// import CartSummary from '../components/CartSummary';

function ProjectPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <>
      <div className="container mt-4">
        {/* <CartSummary /> */}
        <WelcomeHeader />

        <div className="row">
          <div className="col-md-3">
            <div className='card p-3'>
            <CategoryFilter
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
          <div className="col-md-9">
            <BookList selectedCategories={selectedCategories} />
          </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default ProjectPage;
