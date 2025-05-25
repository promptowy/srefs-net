"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Filter, Grid, List, Copy, ZoomIn, Plus, Star, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { LanguageSwitcher } from "@/components/language-switcher"
import Image from "next/image"
import Head from "next/head"
import Link from "next/link"
import { featuredStyle, allStyles, categoriesMapping } from "@/data/styles"
import { getTranslation } from "@/lib/i18n"

const lang = "en"
const t = (key: string) => getTranslation(lang, key)

// Combine all styles (featured + allStyles, without duplicates)
const sampleStyles = [featuredStyle, ...allStyles]

export default function SrefsNetPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(categoriesMapping[lang][0])
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [displayCount, setDisplayCount] = useState(40)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Filter and sort styles
  const filteredAndSortedStyles = useMemo(() => {
    const filtered = sampleStyles.filter((style) => {
      const matchesSearch =
        style.name[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
        style.tags[lang].some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        style.srefCode.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory =
        selectedCategory === categoriesMapping[lang][0] || style.category[lang] === selectedCategory

      return matchesSearch && matchesCategory
    })

    // Sort
    filtered.sort((a, b) => {
      // Always show featured first
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1

      // Then new styles
      if (a.new && !b.new) return -1
      if (!a.new && b.new) return 1

      switch (sortBy) {
        case "name":
          return a.name[lang].localeCompare(b.name[lang])
        case "category":
          return a.category[lang].localeCompare(b.category[lang])
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedCategory, sortBy])

  // Styles to display
  const displayedStyles = filteredAndSortedStyles.slice(0, displayCount)
  const hasMoreStyles = filteredAndSortedStyles.length > displayCount

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(text)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Load more styles
  const loadMoreStyles = () => {
    setDisplayCount((prev) => Math.min(prev + 20, filteredAndSortedStyles.length))
  }

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <Head>
        <title>srefs.net - Best Sref Styles for Midjourney</title>
        <meta
          name="description"
          content="🎨 Discover the best sref styles for Midjourney! Gothic, surreal, photographic and artistic styles. Copy codes with one click and create amazing AI images."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" href="https://srefs.net" />
        <link rel="alternate" hrefLang="pl" href="https://srefs.pl" />
        <link rel="alternate" hrefLang="en" href="https://srefs.net" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-800">
        {/* Structured Data for search engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Sref Styles for Midjourney",
              description: "Collection of reference styles for Midjourney image generator",
              numberOfItems: sampleStyles.length,
              itemListElement: sampleStyles.slice(0, 10).map((style, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "CreativeWork",
                  name: style.name[lang],
                  description: style.example[lang],
                  category: style.category[lang],
                  keywords: style.tags[lang].join(", "),
                },
              })),
            }),
          }}
        />

        <div className="container mx-auto px-4 py-8">
          {/* Header with minimalist logo and language switcher */}
          <header className="text-center mb-12 relative">
            {/* Language Switcher - only desktop */}
            <div className="absolute top-0 right-0 hidden lg:block">
              <LanguageSwitcher currentLang={lang} />
            </div>

            <div className="mb-6">
              {/* Minimalist logo with palette icon - CLICKABLE */}
              <Link href="/" className="inline-block">
                <div className="flex items-center justify-center gap-3 mb-4 cursor-pointer group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Palette className="w-7 h-7 text-gray-800" />
                  </div>
                  <h1 className="text-6xl font-black tracking-tight text-white group-hover:text-gray-100 transition-colors duration-300">
                    srefs.net
                  </h1>
                </div>
              </Link>
              <div className="w-16 h-0.5 bg-white/30 mx-auto rounded-full"></div>
            </div>

            <p className="text-xl text-gray-300 font-medium mb-4">Best Midjourney Styles</p>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
              <strong>Copy codes with one click and create amazing AI images! 🎨</strong>
            </p>

            {/* Article links - more visible */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="https://promptowy.com/kompletny-przewodnik-po-uzywaniu-stylow-srefs-w-midjourney/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-blue-600/30 hover:bg-blue-500/40 p-4 rounded-xl border border-blue-500/50 text-center transition-all duration-200 group"
                >
                  <div className="text-2xl mb-2">📚</div>
                  <h3 className="text-blue-300 font-semibold text-sm group-hover:text-white">
                    Complete guide to using sref styles in Midjourney
                  </h3>
                </a>
                <a
                  href="https://promptowy.com/srefs-w-midjourney-co-to-jest-i-jak-z-niego-korzystac/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-green-600/30 hover:bg-green-500/40 p-4 rounded-xl border border-green-500/50 text-center transition-all duration-200 group"
                >
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className="text-green-300 font-semibold text-sm group-hover:text-white">
                    Sref in Midjourney - what it is and how to use it
                  </h3>
                </a>
                <a
                  href="https://promptowy.com/ewolucja-stylu-midjourney/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-purple-600/30 hover:bg-purple-500/40 p-4 rounded-xl border border-purple-500/50 text-center transition-all duration-200 group"
                >
                  <div className="text-2xl mb-2">🚀</div>
                  <h3 className="text-purple-300 font-semibold text-sm group-hover:text-white">
                    Evolution of Midjourney style
                  </h3>
                </a>
              </div>
            </div>
          </header>

          {/* Featured Style Section */}
          {featuredStyle && (
            <div className="mb-12">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-cyan-500/20 px-4 py-2 rounded-full border border-orange-500/30">
                  <Star className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-300 font-semibold">Featured Style</span>
                </div>
              </div>

              <Card className="bg-gradient-to-br from-gray-800/90 to-teal-800/50 backdrop-blur-sm border-2 border-orange-500/30 shadow-2xl overflow-hidden max-w-4xl mx-auto">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/2 relative">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="cursor-pointer relative group/image">
                          <div className="w-full aspect-square relative overflow-hidden">
                            <Image
                              src={featuredStyle.imageUrl || "/placeholder.svg"}
                              alt={featuredStyle.name[lang]}
                              fill
                              className="object-cover transition-transform duration-500 group-hover/image:scale-105"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/30 transition-all duration-300 flex items-center justify-center">
                            <ZoomIn className="w-12 h-12 text-white opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl bg-gray-800 border-gray-700">
                        <div className="relative w-full aspect-square">
                          <Image
                            src={featuredStyle.imageUrl || "/placeholder.svg"}
                            alt={featuredStyle.name[lang]}
                            fill
                            className="object-contain rounded-lg"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <CardContent className="lg:w-1/2 p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-3xl font-bold text-white">{featuredStyle.name[lang]}</h2>
                      <Badge
                        className="bg-orange-500/20 text-orange-300 border-orange-500/30 cursor-pointer hover:bg-orange-500/30 transition-colors"
                        onClick={() => setSelectedCategory(featuredStyle.category[lang])}
                      >
                        {featuredStyle.category[lang]}
                      </Badge>
                    </div>

                    {/* Sref Code */}
                    <div className="mb-4">
                      <code className="font-mono text-lg font-semibold text-gray-200 bg-gray-700/50 px-4 py-3 rounded-xl block text-center">
                        {featuredStyle.srefCode}
                      </code>
                    </div>

                    {/* Copy Button */}
                    <div className="mb-6">
                      <Button
                        size="lg"
                        onClick={() => copyToClipboard(featuredStyle.srefCode)}
                        className={`w-full transition-all ${
                          copiedCode === featuredStyle.srefCode
                            ? "bg-green-600 hover:bg-green-700 text-white border-green-500"
                            : "bg-orange-600 hover:bg-orange-700 text-white border-orange-500"
                        }`}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {copiedCode === featuredStyle.srefCode ? "Copied!" : "Copy"}
                      </Button>
                    </div>

                    <div className="mb-6">
                      <p className="text-gray-300 leading-relaxed text-center">{featuredStyle.example[lang]}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                      {featuredStyle.tags[lang].map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs bg-teal-700/30 text-teal-300 hover:bg-teal-600/30 cursor-pointer transition-colors border border-teal-600/30"
                          onClick={() => setSearchTerm(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="bg-gray-800/70 backdrop-blur-lg rounded-3xl p-6 mb-8 shadow-2xl border border-gray-700/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap justify-center gap-3">
              {categoriesMapping[lang].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-6 py-2 transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg scale-105 border-0"
                      : "bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-teal-600/20 hover:border-teal-500"
                  }`}
                >
                  {category}
                  <Badge variant="secondary" className="ml-2 bg-gray-600 text-gray-200">
                    {category === categoriesMapping[lang][0]
                      ? sampleStyles.length
                      : sampleStyles.filter((s) => s.category[lang] === category).length}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search styles, tags or sref codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 rounded-2xl border-2 border-gray-600 focus:border-teal-400 bg-gray-800/80 backdrop-blur-sm text-gray-200 placeholder-gray-400"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48 h-12 rounded-2xl border-2 border-gray-600 bg-gray-800/80 backdrop-blur-sm text-gray-200">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="name" className="text-gray-200 focus:bg-teal-600">
                  Name A-Z
                </SelectItem>
                <SelectItem value="category" className="text-gray-200 focus:bg-teal-600">
                  Category
                </SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode - hidden on mobile */}
            <div className="hidden lg:flex bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 border-gray-600 p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`rounded-xl ${viewMode === "grid" ? "bg-teal-600 text-white" : "text-gray-400 hover:text-gray-200"}`}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-xl ${viewMode === "list" ? "bg-teal-600 text-white" : "text-gray-400 hover:text-gray-200"}`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Results Info */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-300">
              Showing <span className="font-bold text-teal-400">{displayedStyles.length}</span> of{" "}
              <span className="font-bold">{filteredAndSortedStyles.length}</span> styles
              {selectedCategory !== categoriesMapping[lang][0] && (
                <span>
                  {" "}
                  in category <span className="font-bold text-teal-400">{selectedCategory}</span>
                </span>
              )}
              {searchTerm && (
                <span>
                  {" "}
                  for search "<span className="font-bold text-green-400">{searchTerm}</span>"
                </span>
              )}
            </p>
          </div>

          {/* Styles Grid/List */}
          {filteredAndSortedStyles.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-300 mb-4">No styles found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory(categoriesMapping[lang][0])
                }}
                className="rounded-full bg-teal-600 hover:bg-teal-700"
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              <div
                className={`grid gap-6 mb-8 ${
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                }`}
              >
                {displayedStyles.map((style) => (
                  <Card
                    key={style.id}
                    className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gray-800/90 backdrop-blur-sm border border-gray-700 shadow-xl overflow-hidden hover:border-teal-500/50 ${
                      viewMode === "list" ? "flex flex-row" : ""
                    } ${style.featured ? "ring-2 ring-orange-500/50" : ""} ${style.new && !style.featured ? "ring-2 ring-green-500/50" : ""}`}
                  >
                    {/* Image */}
                    <div className={`relative overflow-hidden ${viewMode === "list" ? "w-64 flex-shrink-0" : ""}`}>
                      {style.featured && (
                        <div className="absolute top-2 left-2 z-10">
                          <Badge className="bg-orange-500/90 text-white border-0">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}
                      {style.new && !style.featured && (
                        <div className="absolute top-2 left-2 z-10">
                          <Badge className="bg-green-500/90 text-white border-0">NEW</Badge>
                        </div>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="cursor-pointer relative group/image">
                            <div className="aspect-square relative">
                              <Image
                                src={style.imageUrl || "/placeholder.svg"}
                                alt={style.name[lang]}
                                fill
                                className="object-cover transition-transform duration-500 group-hover/image:scale-110"
                              />
                            </div>
                            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/30 transition-all duration-300 flex items-center justify-center">
                              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl bg-gray-800 border-gray-700">
                          <div className="relative w-full aspect-square">
                            <Image
                              src={style.imageUrl || "/placeholder.svg"}
                              alt={style.name[lang]}
                              fill
                              className="object-contain rounded-lg"
                            />
                          </div>
                          {style.description && (
                            <p className="text-center text-gray-400 mt-2">{style.description[lang]}</p>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>

                    <CardContent className="p-6 flex-1">
                      {/* Title - centered */}
                      <h3 className="text-xl font-bold text-gray-200 mb-3 group-hover:text-teal-400 transition-colors text-center">
                        {style.name[lang]}
                      </h3>

                      {/* Meta - centered category */}
                      <div className="flex flex-wrap gap-2 mb-4 justify-center">
                        <Badge
                          variant="outline"
                          className="bg-teal-900/50 text-teal-300 border-teal-600 cursor-pointer hover:bg-teal-800/50 transition-colors"
                          onClick={() => setSelectedCategory(style.category[lang])}
                        >
                          {style.category[lang]}
                        </Badge>
                      </div>

                      {/* Sref Code - above button */}
                      <div className="mb-4">
                        <code className="font-mono text-sm font-semibold text-gray-300 bg-gray-700/50 px-3 py-2 rounded-lg block text-center">
                          {style.srefCode}
                        </code>
                      </div>

                      {/* Copy Button - separate */}
                      <div className="mb-4">
                        <Button
                          size="sm"
                          onClick={() => copyToClipboard(style.srefCode)}
                          className={`w-full transition-all ${
                            copiedCode === style.srefCode
                              ? "bg-green-600 hover:bg-green-700 text-white border-green-500"
                              : "bg-teal-600 hover:bg-teal-700 text-white border-teal-500"
                          }`}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          {copiedCode === style.srefCode ? "Copied!" : "Copy"}
                        </Button>
                      </div>

                      {/* Example - centered */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 text-center">{style.example[lang]}</p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 justify-center">
                        {style.tags[lang].map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs bg-gray-700/50 text-gray-300 hover:bg-teal-600/20 hover:text-teal-300 cursor-pointer transition-colors border border-gray-600"
                            onClick={() => setSearchTerm(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More Button */}
              {hasMoreStyles && (
                <div className="text-center mb-8">
                  <Button
                    onClick={loadMoreStyles}
                    className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Load more ({filteredAndSortedStyles.length - displayCount} remaining)
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Footer with additional SEO information */}
          <footer className="bg-gray-800/70 backdrop-blur-lg rounded-3xl p-8 text-center shadow-2xl border border-gray-700/50 mt-16">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">How to use sref codes in Midjourney?</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-400 mb-6 leading-relaxed">
                <strong>Style Reference (sref)</strong> is a powerful Midjourney feature that allows you to apply a
                specific visual style to your prompts. Add the sref code at the end of your prompt to achieve consistent
                artistic style.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-700/30 p-4 rounded-xl">
                  <h3 className="font-bold text-teal-300 mb-2">1. Choose style</h3>
                  <p className="text-sm text-gray-400">
                    Browse our collection and find the perfect style for your project
                  </p>
                </div>
                <div className="bg-gray-700/30 p-4 rounded-xl">
                  <h3 className="font-bold text-teal-300 mb-2">2. Copy code</h3>
                  <p className="text-sm text-gray-400">Click the copy button next to your chosen style</p>
                </div>
                <div className="bg-gray-700/30 p-4 rounded-xl">
                  <h3 className="font-bold text-teal-300 mb-2">3. Use in Midjourney</h3>
                  <p className="text-sm text-gray-400">Paste the code at the end of your prompt</p>
                </div>
              </div>

              <div className="bg-gray-700/20 p-4 rounded-xl mb-6">
                <h3 className="font-bold text-gray-200 mb-2">Example usage:</h3>
                <code className="bg-gray-700 px-3 py-2 rounded text-gray-300 text-sm">
                  beautiful mountain landscape at sunset --sref 3199463349
                </code>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-500">© 2025 srefs.net - Best sref styles for Midjourney worldwide</p>
                <p className="text-xs text-gray-600 mt-2">
                  Midjourney™ is a trademark of Discord Inc. This site is not officially affiliated with Midjourney.
                </p>
              </div>
            </div>
          </footer>

          {/* Back to Top Button */}
          {showBackToTop && (
            <Button
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 w-12 h-12 rounded-full shadow-2xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:shadow-xl transition-all duration-300 z-50 border border-gray-700"
              size="icon"
            >
              <Plus className="w-5 h-5 rotate-45" />
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
