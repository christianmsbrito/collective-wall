Rails.application.routes.draw do
  # API routes
  namespace :api do
    namespace :v1 do
      resources :chat, only: [:index, :create]

      # /wall
      resources :wall, only: [:index, :show, :create] do
        get  'contributions',     to: 'wall#contributions_index'
        post 'contributions',     to: 'wall#create_contribution'
        post 'close',             to: 'wall#close_wall'
        # get  'contributions/:contribution_id', to: 'walls#show_contribution'
      end
    end
  end

  get '*path', to: 'homepage#index', constraints: ->(req) { req.format.html? && !req.path.start_with?('/api') }

  root 'homepage#index'
end
