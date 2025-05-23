import React, { useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { getTypeColor } from "../../utils/typeColors";
import DOMPurify from "dompurify";
import BlogSidebar from "../BlogSidebar/BlogSidebar";

const SingleBlogPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { note, fetchNoteBySlug, isFetching, error } = useContext(NoteContext);
  const { currentUser, isUserLoading } = useContext(UserContext);

  useEffect(() => {
    console.log(
      `SingleBlogPage Effect: Current slug='${slug}'. Note loaded: ${!!note}, Note slug: '${
        note?.slug
      }', Fetching: ${isFetching}`,
    );
    if (slug && (!note || note.slug !== slug) && !isFetching) {
      console.log(`-> Fetching note for slug: ${slug}`);
      fetchNoteBySlug(slug);
    }
    window.scrollTo(0, 0);
  }, [slug, fetchNoteBySlug, note, isFetching]);

  const handleEdit = () => {
    if (note && note._id) {
      navigate(`/edit-note/${note._id}`);
    } else {
      console.error("Cannot navigate to edit page: Note ID is missing.");
      alert("Could not find note ID for editing.");
    }
  };

  const CenteredMessage = ({ children }) => (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-160px)]">
      {children}
    </div>
  );

  // --- Render Logic ---
  if (isFetching) {
    return (
      <CenteredMessage>
        <LoadingSpinner />
      </CenteredMessage>
    );
  }

  if (error) {
    return (
      <CenteredMessage>
        <div className="card text-center max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-error mb-4">
            Error Loading Post
          </h2>
          <p className="text-error mb-6">{error}</p>
          <div className="flex gap-2 justify-center">
            {slug && (
              <button
                onClick={() => fetchNoteBySlug(slug)}
                className="btn-primary"
                disabled={isFetching}
              >
                Retry
              </button>
            )}
            <Link to="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </CenteredMessage>
    );
  }

  if (!isFetching && !error && (!note || note.slug !== slug)) {
    return (
      <CenteredMessage>
        <div className="card text-center max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-neutral dark:text-gray-100 mb-4">
            Post Not Found
          </h2>
          <p className="text-subtle mb-6">
            The blog post you're looking for might have been moved or deleted.
          </p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </CenteredMessage>
    );
  }

  if (!note) {
    return (
      <CenteredMessage>
        <p>Loading...</p>
      </CenteredMessage>
    );
  }

  // --- Note Content Rendering ---
  const {
    title = "Untitled Post",
    description = "",
    category,
    readTimeMinutes,
    user,
    date,
    _id,
    ancestorPath = [],
  } = note;

  const sanitizedDescription = DOMPurify.sanitize(
    description || "<p>No content available for this post.</p>",
    { USE_PROFILES: { html: true } },
  );
  const authorName = user?.name || "Unknown Author";
  const postDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No date";
  const categoryName = category?.name;
  const categoryColorClass = getTypeColor(categoryName);
  const canEdit =
    !isUserLoading &&
    currentUser &&
    user &&
    (currentUser._id === user._id || currentUser.role === "admin");

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs path={ancestorPath} currentTitle={title} />
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <BlogSidebar currentNote={note} />
        <main className="flex-grow min-w-0">
          <article
            className={`card w-full max-w-4xl ${categoryColorClass} border-t-4`}
          >
            <Link
              to="/"
              className="text-primary hover:underline mb-6 inline-block text-sm"
            >
              ← Back to All Posts
            </Link>
            <div className="flex justify-between items-start mb-4 flex-wrap gap-y-2 gap-x-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral dark:text-gray-100 flex-1 mr-4 break-words hyphens-auto">
                {title}
              </h1>
              {canEdit && (
                <button
                  onClick={handleEdit}
                  className="btn-secondary whitespace-nowrap px-3 py-1.5 text-xs self-start"
                  aria-label={`Edit post titled ${title}`}
                >
                  Edit Post
                </button>
              )}
            </div>
            <div className="text-subtle mb-8 flex flex-wrap gap-x-4 gap-y-2 items-center border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-neutral dark:text-gray-200 overflow-hidden">
                  {user?.profilePictureUrl ? (
                    <img
                      src={user.profilePictureUrl}
                      alt={authorName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    authorName
                      ?.split(" ")
                      .map((n) => n?.[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "?"
                  )}
                </div>
                <span className="font-medium text-neutral dark:text-gray-200">
                  {authorName}
                </span>
              </div>
              <span aria-hidden="true">•</span>
              <time dateTime={date ? new Date(date).toISOString() : undefined}>
                {postDate}
              </time>
              {readTimeMinutes && (
                <>
                  <span aria-hidden="true">•</span>
                  <span>{readTimeMinutes} min read</span>
                </>
              )}
              {categoryName && (
                <>
                  <span aria-hidden="true">•</span>
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-neutral dark:text-gray-300 text-xs font-medium rounded-full capitalize">
                    {categoryName}
                  </span>
                </>
              )}
            </div>
            <div
              className="prose dark:prose-invert max-w-none text-neutral dark:text-gray-200 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            />
          </article>
        </main>
      </div>
    </div>
  );
};

export default SingleBlogPage;
