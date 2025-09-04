import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../middleware/errorHandler'

export interface OAuthProvider {
  name: string
  clientId: string
  clientSecret: string
  redirectUri: string
  authUrl: string
  tokenUrl: string
  userInfoUrl: string
  scope: string
}

export interface OAuthUserInfo {
  id: string
  email: string
  name: string
  picture?: string
  provider: string
}

// OAuth provider configurations
const getProviderConfig = (provider: string): OAuthProvider => {
  const baseRedirectUri = process.env.BACKEND_URL || 'http://localhost:3000'
  
  switch (provider) {
    case 'google':
      return {
        name: 'google',
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        redirectUri: `${baseRedirectUri}/api/auth/oauth/google/callback`,
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
        scope: 'openid email profile'
      }
    
    case 'github':
      return {
        name: 'github',
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        redirectUri: `${baseRedirectUri}/api/auth/oauth/github/callback`,
        authUrl: 'https://github.com/login/oauth/authorize',
        tokenUrl: 'https://github.com/login/oauth/access_token',
        userInfoUrl: 'https://api.github.com/user',
        scope: 'user:email'
      }
    
    case 'facebook':
      return {
        name: 'facebook',
        clientId: process.env.FACEBOOK_CLIENT_ID!,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        redirectUri: `${baseRedirectUri}/api/auth/oauth/facebook/callback`,
        authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
        tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
        userInfoUrl: 'https://graph.facebook.com/v18.0/me',
        scope: 'email,public_profile'
      }
    
    default:
      throw new AppError(`Unsupported OAuth provider: ${provider}`, StatusCodes.BAD_REQUEST)
  }
}

// Generate OAuth authorization URL
export const generateAuthUrl = (provider: string, state?: string): string => {
  const config = getProviderConfig(provider)
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    response_type: 'code',
    ...(state && { state })
  })
  
  return `${config.authUrl}?${params.toString()}`
}

// Exchange authorization code for access token
export const exchangeCodeForToken = async (provider: string, code: string): Promise<string> => {
  const config = getProviderConfig(provider)
  
  try {
    const response = await axios.post(config.tokenUrl, {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code'
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    
    return response.data.access_token
  } catch (error: any) {
    console.error(`Error exchanging code for token (${provider}):`, error.response?.data || error.message)
    throw new AppError(`Failed to exchange authorization code for access token`, StatusCodes.BAD_REQUEST)
  }
}

// Fetch user information from OAuth provider
export const fetchUserInfo = async (provider: string, accessToken: string): Promise<OAuthUserInfo> => {
  const config = getProviderConfig(provider)
  
  try {
    let userInfoUrl = config.userInfoUrl
    
    // Add fields parameter for Facebook
    if (provider === 'facebook') {
      userInfoUrl += '?fields=id,name,email,picture'
    }
    
    const response = await axios.get(userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    })
    
    const userData = response.data
    
    // Normalize user data across providers
    let userInfo: OAuthUserInfo
    
    switch (provider) {
      case 'google':
        userInfo = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
          provider: 'google'
        }
        break
        
      case 'github':
        // GitHub might require a separate call for email if it's private
        let email = userData.email
        if (!email) {
          const emailResponse = await axios.get('https://api.github.com/user/emails', {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json'
            }
          })
          const primaryEmail = emailResponse.data.find((e: any) => e.primary)
          email = primaryEmail?.email
        }
        
        userInfo = {
          id: userData.id.toString(),
          email: email,
          name: userData.name || userData.login,
          picture: userData.avatar_url,
          provider: 'github'
        }
        break
        
      case 'facebook':
        userInfo = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          picture: userData.picture?.data?.url,
          provider: 'facebook'
        }
        break
        
      default:
        throw new AppError(`Unsupported provider: ${provider}`, StatusCodes.BAD_REQUEST)
    }
    
    if (!userInfo.email) {
      throw new AppError(`Email not provided by ${provider}`, StatusCodes.BAD_REQUEST)
    }
    
    return userInfo
    
  } catch (error: any) {
    console.error(`Error fetching user info (${provider}):`, error.response?.data || error.message)
    throw new AppError(`Failed to fetch user information from ${provider}`, StatusCodes.BAD_REQUEST)
  }
}

// Validate OAuth provider
export const isValidProvider = (provider: string): boolean => {
  return ['google', 'github', 'facebook'].includes(provider)
}
