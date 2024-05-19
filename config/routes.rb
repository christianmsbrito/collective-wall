Rails.application.routes.draw do
  # WEB routes
  root 'homepage#index'

  # API routes
  namespace :api do
    namespace :v1 do
      resources :chat, only: [:index, :create]

      # /wall
      resources :wall, only: [:index, :show, :create] do
        get  'contributions',     to: 'wall#contributions_index'
        post 'contributions',     to: 'wall#create_contribution'
        # get  'contributions/:contribution_id', to: 'walls#show_contribution'
      end
    end
  end
end
