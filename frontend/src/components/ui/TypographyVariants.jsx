import { Typography, createTheme, ThemeProvider } from "@mui/material"

// Thème personnalisé
const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
      marginTop: "1.5rem",
      marginBottom: "1rem",
      color: "#212121",
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 700,
      marginTop: "1.5rem",
      marginBottom: "1rem",
      color: "#212121",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 700,
      marginTop: "1.5rem",
      marginBottom: "1rem",
      color: "#212121",
    },
    h4: {
      fontSize: "1.2rem",
      fontWeight: 700,
      marginTop: "1.5rem",
      marginBottom: "1rem",
      color: "#212121",
    },
    subtitle1: {
      fontSize: "1.25rem",
      fontWeight: 400,
      marginTop: "1rem",
      marginBottom: "0.75rem",
      color: "#212121",
    },
    paragraphe: {
      fontSize: "0.875rem",
      fontWeight: 300,
      color: "#616161",
    },
  },
})

// Chaque composant typographique
const withTheme = (Component) => (props) =>
  (
    <ThemeProvider theme={theme}>
      <Component {...props} />
    </ThemeProvider>
  )

export const H1 = withTheme((props) => (
  <Typography variant="h1" component="h1" {...props} />
))

export const H2 = withTheme((props) => (
  <Typography variant="h2" component="h2" {...props} />
))

export const H3 = withTheme((props) => (
  <Typography variant="h3" component="h3" {...props} />
))

export const H4 = withTheme((props) => (
  <Typography variant="h4" component="h4" {...props} />
))

export const Subtitle1 = withTheme((props) => (
  <Typography variant="subtitle1" component="h5" {...props} />
))

export const Paragraphe = withTheme((props) => (
  <Typography variant="paragraphe" component="p" {...props} />
))
